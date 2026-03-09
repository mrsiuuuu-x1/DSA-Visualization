let stepDelay = 900;

function syntaxHL(raw) {
  let comment = '';
  let code = raw;
  const commentIdx = raw.indexOf('#');
  if (commentIdx !== -1) {
    comment = raw.slice(commentIdx);
    code = raw.slice(0, commentIdx).trimEnd();
  }
  let s = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const strings = [];
  s = s.replace(/'([^']*)'/g, (_, inner) => {
    strings.push(`<span class="str">'${inner}'</span>`);
    return `\x00S${strings.length - 1}\x00`;
  });
  s = s.replace(/"([^"]*)"/g, (_, inner) => {
    strings.push(`<span class="str">"${inner}"</span>`);
    return `\x00S${strings.length - 1}\x00`;
  });
  s = s.replace(/\b(def|class|return|if|else|elif|for|while|in|not|and|or|None|True|False|import|from|pass|self|break)\b/g, '<span class="kw">$1</span>');
  s = s.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>');
  s = s.replace(/(^|[\s,=\[(<>!])(-?\d+)(?=[\s,\])<>!;+\-*\/]|$)/g, '$1<span class="num">$2</span>');
  s = s.replace(/\x00S(\d+)\x00/g, (_, idx) => strings[idx]);
  if (comment) {
    const escaped = comment.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    s += (s ? ' ' : '') + `<span class="cmt">${escaped}</span>`;
  }
  return s;
}

function renderCode(preId, lines) {
  const pre = document.getElementById(preId);
  pre.innerHTML = lines.map((l, i) => {
    const content = l.trim() === '' ? '&nbsp;' : syntaxHL(l);
    const emptyClass = l.trim() === '' ? ' empty-line' : '';
    return `<span class="code-line${emptyClass}" data-ln="${l.trim()===''?'':i+1}" id="${preId}-line-${i}">${content}</span>`;
  }).join('\n');
}

function highlightLine(preId, lineIdx, prevIdx) {
  if (prevIdx !== null && prevIdx >= 0) {
    const prev = document.getElementById(`${preId}-line-${prevIdx}`);
    if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
  }
  if (lineIdx >= 0) {
    const el = document.getElementById(`${preId}-line-${lineIdx}`);
    if (el) { el.classList.add('active'); }
  }
}

function makeController(stepBtn, resetBtn, autoBtn, stepNumEl, stepTotalEl, steps, runStep, doReset) {
  let current = 0;
  let autoTimer = null;
  stepTotalEl.textContent = steps.length;
  stepNumEl.textContent = 0;

  function next() {
    if (current < steps.length) {
      runStep(current);
      current++;
      stepNumEl.textContent = current;
    }
    if (current >= steps.length && autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
      autoBtn.textContent = '▶ Auto';
    }
  }

  stepBtn.addEventListener('click', next);

  autoBtn.addEventListener('click', () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
      autoBtn.textContent = '▶ Auto';
    } else {
      autoBtn.textContent = '⏸ Pause';
      autoTimer = setInterval(next, stepDelay);
    }
  });

  resetBtn.addEventListener('click', () => {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; autoBtn.textContent = '▶ Auto'; }
    current = 0;
    stepNumEl.textContent = 0;
    doReset();
  });
}