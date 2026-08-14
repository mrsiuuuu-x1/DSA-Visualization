let stepDelay = 900;

function syntaxHL(raw) {
  const strings = [];
  let preprocessed = raw;

  // Extract single-quoted strings
  preprocessed = preprocessed.replace(/'([^']*)'/g, (_, inner) => {
    strings.push(`'${inner}'`);
    return `\x00S${strings.length - 1}\x00`;
  });
  // Extract double-quoted strings
  preprocessed = preprocessed.replace(/"([^"]*)"/g, (_, inner) => {
    strings.push(`"${inner}"`);
    return `\x00S${strings.length - 1}\x00`;
  });

  // Now detect comments on the preprocessed line (strings replaced with placeholders)
  let comment = '';
  let code = preprocessed;
  const commentIdx = preprocessed.indexOf('#');
  if (commentIdx !== -1) {
    comment = preprocessed.slice(commentIdx);
    code = preprocessed.slice(0, commentIdx).trimEnd();
  }

  // HTML-escape the code part
  let s = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Now wrap string placeholders with styled spans
  // We need to restore the original strings and apply highlighting
  s = s.replace(/\x00S(\d+)\x00/g, (_, idx) => {
    const original = strings[idx]
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<span class="str">${original}</span>`;
  });

  // Keywords
  s = s.replace(/\b(def|class|return|if|else|elif|for|while|in|not|and|or|None|True|False|import|from|pass|self|break|continue|global|try|except|finally|raise|with|as|lambda|yield)\b/g, '<span class="kw">$1</span>');
  // Function calls
  s = s.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>');
  // Numbers
  s = s.replace(/(^|[\s,=\[(<>!])(-?\d+)(?=[\s,\])<>!;+\-*\/]|$)/g, '$1<span class="num">$2</span>');

  // Restore comment (also restore any strings inside the comment for display)
  if (comment) {
    let commentDisplay = comment;
    commentDisplay = commentDisplay.replace(/\x00S(\d+)\x00/g, (_, idx) => strings[idx]);
    const escaped = commentDisplay.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
      clearTimeout(autoTimer);
      autoTimer = null;
      autoBtn.textContent = '▶ Auto';
    }
  }

  function scheduleNext() {
    autoTimer = setTimeout(() => {
      next();
      if (autoTimer !== null && current < steps.length) {
        scheduleNext();
      }
    }, stepDelay);
  }

  stepBtn.addEventListener('click', next);

  autoBtn.addEventListener('click', () => {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
      autoBtn.textContent = '▶ Auto';
    } else {
      autoBtn.textContent = '⏸ Pause';
      scheduleNext();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; autoBtn.textContent = '▶ Auto'; }
    current = 0;
    stepNumEl.textContent = 0;
    doReset();
  });
}