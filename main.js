document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
  });
});

// Step - Interactive mode toggles
function setupModeToggle(name) {
  const btn         = document.getElementById(`${name}-mode-toggle`);
  const stepDiv     = document.getElementById(`${name}-step-mode`);
  const interactDiv = document.getElementById(`${name}-interactive-mode`);
  let interactive   = false;
  btn.addEventListener('click', () => {
    interactive = !interactive;
    btn.classList.toggle('active', interactive);
    btn.textContent = interactive ? '📖 Step Mode' : '⚡ Interactive Mode';
    stepDiv.style.display = interactive ? 'none' : 'block';
    interactDiv.classList.toggle('hidden', !interactive);
    const cv = document.getElementById(`${name}-interactive-code`);
    const ed = document.getElementById(`${name}-editor`);
    if (cv) cv.style.display = 'none';
    if (ed) ed.style.display = '';
  });
}
setupModeToggle('array');
setupModeToggle('linkedlist');
setupModeToggle('stack');
setupModeToggle('queue');
setupModeToggle('tree');

// Python status labels
document.querySelectorAll('.pyodide-status').forEach(el => {
  el.textContent = '✓ Python ready';
  el.classList.add('ready');
});

// Speed sliders
function injectSpeedSliders() {
  document.querySelectorAll('.controls, .editor-controls').forEach(row => {
    if (row.querySelector('.speed-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'speed-wrap';
    wrap.title = 'Animation speed';
    wrap.innerHTML = `
      <span class="speed-label" aria-hidden="true">🐢</span>
      <input type="range" class="speed-slider" min="200" max="2000" step="100" value="900"
             aria-label="Animation speed">
      <span class="speed-label" aria-hidden="true">⚡</span>
    `;
    row.appendChild(wrap);
    wrap.querySelector('.speed-slider').addEventListener('input', e => {
      stepDelay = 2200 - Number(e.target.value);
      document.querySelectorAll('.speed-slider').forEach(s => { s.value = e.target.value; });
    });
  });
}
injectSpeedSliders();

// Inline hints
setupInlineHints('array-editor');
setupInlineHints('linkedlist-editor');
setupInlineHints('stack-editor');
setupInlineHints('queue-editor');
setupInlineHints('tree-editor');

// Keyboard shortcuts
document.querySelectorAll('.code-editor').forEach(editor => {
  editor.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end   = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const panel  = editor.closest('.code-panel');
      const runBtn = panel && panel.querySelector('.run-btn');
      if (runBtn && !runBtn.disabled) runBtn.click();
    }
  });
});

document.querySelectorAll('.editor-controls').forEach(row => {
  if (row.querySelector('.kbd-hint')) return;
  const hint = document.createElement('span');
  hint.className = 'kbd-hint';
  hint.textContent = 'Ctrl+Enter to run · Tab to indent';
  row.appendChild(hint);
});