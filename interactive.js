function smartErrorMsg(rawError, varName, userCode) {
  const e = rawError.toString();
  if (varName && /^[A-Z]/.test(varName))
    return `<b>${varName}</b> looks like a class name, not a variable. Tag a variable instead — e.g. add a <code>snapshot()</code> method and use <code># @visualize snapshot</code>.`;
  if (/import/.test(userCode))
    return `Skulpt (the in-browser Python engine) doesn't support most <code>import</code> statements. Remove the import and use plain Python instead.`;
  const nameMatch = e.match(/NameError.*name '(\w+)'/);
  if (nameMatch) {
    const n = nameMatch[1];
    if (/^[A-Z]/.test(n))
      return `<b>${n}</b> is a class, not a variable — you can't visualize it directly. Add a <code>snapshot()</code> or <code>to_list()</code> method and tag that instead.`;
    return `Variable <b>${n}</b> not found. Make sure the name in <code># @visualize ${n}</code> matches exactly.`;
  }
  const attrMatch = e.match(/AttributeError.*'(\w+)'/);
  if (attrMatch) return `AttributeError on <b>${attrMatch[1]}</b> — check your method names and that the object is initialised before use.`;
  if (/IndentationError/.test(e)) return `Indentation error — check your spacing. Python uses 4 spaces per indent level.`;
  if (/SyntaxError/.test(e)) return `Syntax error — look for missing colons, brackets, or quotes.`;
  if (/TypeError/.test(e)) return `Type error — you may be passing the wrong type of value to a function.`;
  const cleaned = e.replace(/^.*?Error/, m => `<b>${m}</b>`).split('\n')[0];
  return cleaned || e;
}

// ── Inline hint watcher ───────────────────────────────────────
function setupInlineHints(editorId) {
  const editor = document.getElementById(editorId);
  if (!editor) return;
  const hint = document.createElement('div');
  hint.className = 'inline-hint';
  hint.style.display = 'none';
  editor.parentElement.insertBefore(hint, editor.nextSibling);
  editor.addEventListener('input', () => {
    const code = editor.value;
    const vizMatch = code.match(/#\s*@visualize\s+(\w+)/);
    if (/^\s*import\s/m.test(code)) {
      hint.style.display = '';
      hint.innerHTML = `⚠ <code>import</code> statements aren't supported — remove them before running.`;
      return;
    }
    if (vizMatch && /^[A-Z]/.test(vizMatch[1])) {
      hint.style.display = '';
      hint.innerHTML = `⚠ <b>${vizMatch[1]}</b> looks like a class name — visualize a variable instead (e.g. a <code>snapshot()</code> list).`;
      return;
    }
    hint.style.display = 'none';
  });
}

// ── Skulpt runner ─────────────────────────────────────────────
function runSkulpt(code) {
  return new Promise((resolve, reject) => {
    let output = '';
    Sk.configure({
      output: s => { output += s; },
      read: f => {
        if (Sk.builtinFiles?.files[f] !== undefined) return Sk.builtinFiles.files[f];
        throw new Error(`File not found: '${f}'`);
      },
      __future__: Sk.python3
    });
    Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody('<stdin>', false, code, true)
    ).then(() => resolve(output), err => reject(err));
  });
}

// ── Main visualize runner ─────────────────────────────────────
async function runVisualize(userCode, diagramEl, calloutEl, statusEl, renderFn, runBtn, codeViewId, editorId) {
  if (runBtn) runBtn.disabled = true;

  // Clear any inline hint
  const editorElForHint = editorId ? document.getElementById(editorId) : null;
  if (editorElForHint) {
    const hint = editorElForHint.parentElement.querySelector('.inline-hint');
    if (hint) hint.style.display = 'none';
  }

  const codeViewEl = codeViewId ? document.getElementById(codeViewId) : null;
  const editorEl   = editorId   ? document.getElementById(editorId)   : null;
  if (codeViewEl) codeViewEl.style.display = 'none';
  if (editorEl)   editorEl.style.display = '';

  const tagMatch = userCode.match(/#\s*@visualize\s+(\w+)/);
  if (!tagMatch) {
    calloutEl.innerHTML = `<span style="color:#ff5a5a">Add <code># @visualize YourVarName</code> anywhere in your code.</span>`;
    if (runBtn) runBtn.disabled = false;
    return;
  }
  const varName = tagMatch[1];

  // Build instrumented code
  const lines = userCode.split('\n');
  const out = [];
  out.push('def _dumps(obj):');
  out.push('    if isinstance(obj, bool):');
  out.push('        if obj:');
  out.push('            return "true"');
  out.push('        return "false"');
  out.push('    if obj is None:');
  out.push('        return "null"');
  out.push('    if isinstance(obj, int) or isinstance(obj, float):');
  out.push('        return str(obj)');
  out.push('    if isinstance(obj, str):');
  out.push('        s = obj.replace(chr(92), chr(92)+chr(92))');
  out.push('        s = s.replace(chr(34), chr(92)+chr(34))');
  out.push('        s = s.replace(chr(10), chr(92)+chr(110))');
  out.push('        s = s.replace(chr(13), chr(92)+chr(114))');
  out.push('        s = s.replace(chr(9), chr(92)+chr(116))');
  out.push('        return chr(34) + s + chr(34)');
  out.push('    if isinstance(obj, list):');
  out.push('        return "[" + ", ".join([_dumps(v) for v in obj]) + "]"');
  out.push('    if isinstance(obj, dict):');
  out.push('        items = []');
  out.push('        for k in obj:');
  out.push('            items.append(_dumps(str(k)) + ": " + _dumps(obj[k]))');
  out.push('        return "{" + ", ".join(items) + "}"');
  out.push('    return _dumps(str(obj))');
  out.push('def _deepcopy(obj):');
  out.push('    if isinstance(obj, list):');
  out.push('        return [_deepcopy(x) for x in obj]');
  out.push('    if isinstance(obj, dict):');
  out.push('        r = {}');
  out.push('        for k in obj:');
  out.push('            r[k] = _deepcopy(obj[k])');
  out.push('        return r');
  out.push('    return obj');
  out.push('_snapshots = []');
  out.push('_labels = []');
  out.push('_lineNums = []');

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    out.push(line);
    const s = line.trim();
    if (!s || s.startsWith('#') || /^(def |class |if |elif |else:|for |while |with |try:|except|finally:|return\b|pass\b|break\b|continue\b)/.test(s)) continue;
    const indent = line.match(/^(\s*)/)[0];
    out.push(
      `${indent}try:\n` +
      `${indent}  _tmp = _deepcopy(${varName})\n` +
      `${indent}  _snapshots.append(_tmp)\n` +
      `${indent}  _labels.append(${JSON.stringify(s.slice(0, 60))})\n` +
      `${indent}  _lineNums.append(${li})\n` +
      `${indent}except:\n` +
      `${indent}  pass`
    );
  }
  out.push('print(_dumps({"snapshots": _snapshots, "labels": _labels, "lineNums": _lineNums}))');

  statusEl.textContent = 'Running...';
  statusEl.className = 'pyodide-status';

  try {
    const output = await runSkulpt(out.join('\n'));
    const lastLine = output.trim().split('\n').pop();
    const parsed = JSON.parse(lastLine);
    const rawSnaps = parsed.snapshots;
    const rawLabels = parsed.labels;
    const rawLineNums = parsed.lineNums;

    const steps = [];
    let prev = null;
    for (let i = 0; i < rawSnaps.length; i++) {
      const key = JSON.stringify(rawSnaps[i]);
      if (key !== prev) {
        steps.push({ snap: rawSnaps[i], label: rawLabels[i], line: rawLineNums && i < rawLineNums.length ? rawLineNums[i] : -1 });
        prev = key;
      }
    }

    if (steps.length === 0) {
      calloutEl.innerHTML = `<span style="color:#ff5a5a">No changes on <code>${varName}</code>. Check the variable name matches exactly.</span>`;
      statusEl.textContent = '✓ Python ready';
      statusEl.classList.add('ready');
      if (runBtn) runBtn.disabled = false;
      return;
    }

    statusEl.textContent = '✓ Python ready';
    statusEl.classList.add('ready');
    if (runBtn) runBtn.disabled = false;

    if (codeViewEl && editorEl) {
      renderCode(codeViewId, lines);
      editorEl.style.display = 'none';
      codeViewEl.style.display = '';
    }

    let i = 0;
    let playPrevLine = null;
    function play() {
      if (i >= steps.length) {
        const lastSnap = steps[steps.length - 1].snap;
        const count = Array.isArray(lastSnap[0])
          ? lastSnap.filter(v => Array.isArray(v) && !(v[0] === -1 && v[1] === -1 && v[2] === -1)).length
          : lastSnap.filter(v => v !== -1 && v !== '' && v !== null).length;
        calloutEl.innerHTML = `✅ Done — <strong>${varName}</strong> has ${count} item(s)`;
        return;
      }
      const { snap, label, line } = steps[i];
      renderFn(diagramEl, snap, varName);
      calloutEl.innerHTML = `<code>${label}</code>`;
      if (codeViewEl && line >= 0) {
        highlightLine(codeViewId, line, playPrevLine);
        playPrevLine = line;
      }
      i++;
      setTimeout(play, stepDelay);
    }
    play();

  } catch (e) {
    statusEl.textContent = '✗ Error';
    statusEl.classList.add('error');
    if (runBtn) runBtn.disabled = false;
    if (codeViewEl) codeViewEl.style.display = 'none';
    if (editorEl)   editorEl.style.display = '';
    calloutEl.innerHTML = `<span style="color:#ff5a5a">${smartErrorMsg(e, varName, userCode)}</span>`;
  }
}

// ── Interactive render functions ──────────────────────────────

function renderInteractiveArray(diagramEl, snap) {
  diagramEl.innerHTML = '';
  const filled = snap.filter(v => v !== null && v !== '');
  if (filled.length === 0) {
    diagramEl.innerHTML = '<span class="diagram-placeholder">[ empty ]</span>';
    return;
  }
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;';
  filled.forEach((val, i) => {
    const box = document.createElement('div');
    box.className = 'arr-box';
    box.innerHTML = `<div class="arr-cell">${val}</div><div class="arr-idx">[${i}]</div>`;
    row.appendChild(box);
  });
  diagramEl.appendChild(row);
}

function renderInteractiveStack(diagramEl, snap, varName) {
  diagramEl.innerHTML = '';
  const filled = snap.filter(v => v !== -1 && v !== '' && v !== null);
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:2rem;align-items:center;justify-content:center;width:100%;';
  const left = document.createElement('div');
  left.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;min-width:100px;';
  if (filled.length === 0) {
    left.innerHTML = '<span class="diagram-placeholder">[ empty ]</span>';
  } else {
    const lbl = document.createElement('div');
    lbl.style.cssText = 'font-family:var(--mono);font-size:.65rem;color:var(--accent);margin-bottom:2px;';
    lbl.textContent = '▲ TOP';
    left.appendChild(lbl);
    [...filled].reverse().forEach((v, ri) => {
      const el = document.createElement('div');
      el.className = 'stack-item' + (ri === 0 ? ' top-item' : '');
      el.textContent = v;
      left.appendChild(el);
    });
  }
  const right = document.createElement('div');
  right.style.cssText = 'font-family:var(--mono);font-size:.72rem;display:flex;flex-direction:column;gap:4px;';
  right.innerHTML = `<div style="color:var(--text-dim)">${varName}</div><div style="color:var(--accent);font-size:1rem;font-weight:700;">${filled.length} item(s)</div>`;
  wrap.appendChild(left);
  wrap.appendChild(right);
  diagramEl.appendChild(wrap);
}

function renderInteractiveQueue(diagramEl, snap, varName) {
  diagramEl.innerHTML = '';
  const filled = snap.filter(v => v !== '' && v !== null && v !== -1);
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center;width:100%;';
  if (filled.length === 0) {
    row.innerHTML = '<span class="diagram-placeholder">[ empty queue ]</span>';
  } else {
    filled.forEach((v, i) => {
      const el = document.createElement('div');
      el.className = 'queue-item'
        + (i === 0 ? ' front-item' : '')
        + (i === filled.length - 1 ? ' rear-item' : '');
      el.textContent = v;
      row.appendChild(el);
    });
  }
  diagramEl.appendChild(row);
  if (filled.length > 0) {
    const info = document.createElement('div');
    info.style.cssText = 'display:flex;gap:1.5rem;margin-top:.6rem;font-family:var(--mono);font-size:.72rem;justify-content:center;';
    info.innerHTML = `<span style="color:var(--accent2)">Front: <strong>${filled[0]}</strong></span><span style="color:var(--accent)">Rear: <strong>${filled[filled.length-1]}</strong></span><span style="color:var(--text-dim)">Count: <strong>${filled.length}</strong></span>`;
    diagramEl.appendChild(info);
  }
}

function renderInteractiveLinkedList(diagramEl, snap) {
  diagramEl.innerHTML = '';
  const filled = snap.filter(v => v !== null && v !== '' && v !== -1);
  if (filled.length === 0) {
    diagramEl.innerHTML = '<span class="diagram-placeholder">head → None</span>';
    return;
  }
  const cont = document.createElement('div');
  cont.className = 'll-container';
  filled.forEach((val, i) => {
    const node = document.createElement('div');
    node.className = 'll-node';
    const isLast = i === filled.length - 1;
    node.innerHTML = `
      <div class="ll-cell">
        <div class="ll-val">${val}</div>
        <div class="ll-ptr">${isLast ? 'None' : '→'}</div>
      </div>
      ${!isLast ? '<div class="ll-arrow">→</div>' : ''}`;
    cont.appendChild(node);
  });
  diagramEl.appendChild(cont);
}

function renderInteractiveTree(diagramEl, snap, varName) {
  diagramEl.innerHTML = '';
  const treeArr = [];
  for (let i = 0; i < snap.length; i++) {
    const item = snap[i];
    if (Array.isArray(item) && !(item[0] === -1 && item[1] === -1 && item[2] === -1)) {
      treeArr.push({ data: item[1], left: item[0], right: item[2] });
    } else {
      break;
    }
  }

  if (treeArr.length === 0) {
    diagramEl.innerHTML = '<span class="diagram-placeholder">[ empty tree ]</span>';
    return;
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '300');
  svg.style.overflow = 'visible';

  const W = diagramEl.clientWidth || 480;
  const positions = computePositions(treeArr, 0, W);

  treeArr.forEach((n, i) => {
    [[n.left, 'left'], [n.right, 'right']].forEach(([childIdx]) => {
      if (childIdx === -1) return;
      const p = positions[i], c = positions[childIdx];
      if (!p || !c) return;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', p.x); line.setAttribute('y1', p.y);
      line.setAttribute('x2', c.x); line.setAttribute('y2', c.y);
      line.setAttribute('class', 'tree-edge');
      svg.appendChild(line);
    });
  });

  treeArr.forEach((n, i) => {
    const pos = positions[i];
    if (!pos) return;
    const g = document.createElementNS(svgNS, 'g');
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y); circle.setAttribute('r', 22);
    circle.setAttribute('class', 'tree-circle');
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
    text.setAttribute('class', 'tree-text'); text.textContent = n.data;
    const idxLabel = document.createElementNS(svgNS, 'text');
    idxLabel.setAttribute('x', pos.x); idxLabel.setAttribute('y', pos.y - 28);
    idxLabel.setAttribute('class', 'tree-text');
    idxLabel.style.fontSize = '10px'; idxLabel.style.fill = 'var(--text-dim)';
    idxLabel.textContent = '[' + i + ']';
    g.appendChild(circle); g.appendChild(text); g.appendChild(idxLabel);
    svg.appendChild(g);
  });

  diagramEl.appendChild(svg);

  // L/D/R table
  const table = document.createElement('div');
  table.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-top:8px;width:100%;overflow-x:auto;';
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.65rem;color:var(--text-dim);';
  header.innerHTML = '<div style="width:32px;text-align:center">idx</div>'
    + treeArr.map((_, i) => `<div style="width:44px;text-align:center">[${i}]</div>`).join('');
  table.appendChild(header);
  const leftRow = document.createElement('div');
  leftRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.7rem;';
  leftRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">L</div>'
    + treeArr.map(n => `<div style="width:44px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:var(--text-dim)">${n.left}</div>`).join('');
  table.appendChild(leftRow);
  const dataRow = document.createElement('div');
  dataRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.75rem;font-weight:700;';
  dataRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">D</div>'
    + treeArr.map(n => `<div style="width:44px;text-align:center;padding:4px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:var(--text)">${n.data}</div>`).join('');
  table.appendChild(dataRow);
  const rightRow = document.createElement('div');
  rightRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.7rem;';
  rightRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">R</div>'
    + treeArr.map(n => `<div style="width:44px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:var(--text-dim)">${n.right}</div>`).join('');
  table.appendChild(rightRow);
  diagramEl.appendChild(table);
}