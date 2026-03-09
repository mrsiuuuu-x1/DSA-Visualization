const stackCode = [
  "Stack = [-1] * 30",
  "TopOfStack = -1",
  "",
  "def Push(item):",
  "    global Stack, TopOfStack",
  "    if TopOfStack > 29:",
  "        return False",
  "    else:",
  "        TopOfStack += 1",
  "        Stack[TopOfStack] = item",
  "        return True",
  "",
  "def Pop():",
  "    global Stack, TopOfStack",
  "    if TopOfStack == -1:",
  "        return -999",
  "    else:",
  "        value = Stack[TopOfStack]",
  "        TopOfStack -= 1",
  "        return value",
  "",
  "Push(10)",
  "Push(25)",
  "Push(7)",
  "Push(43)",
  "Push(18)",
  "",
  "Pop()",
  "Pop()",
];

const stackDiagramEl = document.getElementById('stack-diagram');
const stackCalloutEl = document.getElementById('stack-callout');

function renderStackDiagram(items, topIdx) {
  stackDiagramEl.innerHTML = '';

  const left = document.createElement('div');
  left.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;min-width:120px;';

  if (items.length === 0) {
    left.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">[ empty ]</span>';
  } else {
    const lbl = document.createElement('div');
    lbl.style.cssText = 'font-family:var(--mono);font-size:.65rem;color:var(--accent);letter-spacing:.08em;margin-bottom:2px;';
    lbl.textContent = '▲ TOP';
    left.appendChild(lbl);
    [...items].reverse().forEach((v, ri) => {
      const el = document.createElement('div');
      el.className = 'stack-item' + (ri === 0 ? ' top-item' : '');
      el.textContent = v;
      left.appendChild(el);
    });
  }

  const right = document.createElement('div');
  right.style.cssText = 'display:flex;flex-direction:column;justify-content:center;gap:4px;font-family:var(--mono);font-size:.72rem;';
  right.innerHTML = `
    <div style="color:var(--text-dim)">TopOfStack</div>
    <div style="color:var(--accent);font-size:1rem;font-weight:700;">${topIdx}</div>
    <div style="color:var(--text-dim);font-size:.65rem;">Stack[${topIdx}] = ${topIdx >= 0 ? items[items.length-1] : '—'}</div>
  `;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:2rem;align-items:center;justify-content:center;width:100%;';
  wrap.appendChild(left);
  wrap.appendChild(right);
  stackDiagramEl.appendChild(wrap);
}

const stackSteps = [
  { line:0,  items:[], top:-1, msg:"<code>Stack = [-1] * 30</code> — pre-allocate array of 30 slots, all -1" },
  { line:1,  items:[], top:-1, msg:"<code>TopOfStack = -1</code> — -1 means the stack is empty" },
  { line:3,  items:[], top:-1, msg:"<code>def Push(item)</code> — checks if full (TopOfStack > 29), then increments and inserts" },
  { line:12, items:[], top:-1, msg:"<code>def Pop()</code> — checks if empty (TopOfStack == -1), then reads value and decrements" },
  { line:21, items:[10],           top:0, msg:"<code>Push(10)</code> — TopOfStack: -1→0, Stack[0] = 10" },
  { line:22, items:[10,25],        top:1, msg:"<code>Push(25)</code> — TopOfStack: 0→1, Stack[1] = 25" },
  { line:23, items:[10,25,7],      top:2, msg:"<code>Push(7)</code> — TopOfStack: 1→2, Stack[2] = 7" },
  { line:24, items:[10,25,7,43],   top:3, msg:"<code>Push(43)</code> — TopOfStack: 2→3, Stack[3] = 43" },
  { line:25, items:[10,25,7,43,18],top:4, msg:"<code>Push(18)</code> — TopOfStack: 3→4, Stack[4] = 18" },
  { line:27, items:[10,25,7,43],   top:3, msg:"<code>Pop()</code> — value = Stack[4] = 18, TopOfStack: 4→3. Returns 18" },
  { line:28, items:[10,25,7],      top:2, msg:"<code>Pop()</code> — value = Stack[3] = 43, TopOfStack: 3→2. Returns 43" },
];

let stkState = { prevLine: null };

function resetStack() {
  stkState = { prevLine: null };
  renderCode('stack-code', stackCode);
  renderStackDiagram([], -1);
  stackCalloutEl.innerHTML = 'Press <strong>Step →</strong> to begin';
}

renderCode('stack-code', stackCode);
renderStackDiagram([], -1);

makeController(
  document.getElementById('stack-step'),
  document.getElementById('stack-reset'),
  document.getElementById('stack-auto'),
  document.getElementById('stack-step-num'),
  document.getElementById('stack-step-total'),
  stackSteps,
  (i) => {
    const s = stackSteps[i];
    highlightLine('stack-code', s.line, stkState.prevLine);
    stkState.prevLine = s.line;
    renderStackDiagram(s.items, s.top);
    stackCalloutEl.innerHTML = s.msg;
  },
  resetStack
);

// Interactive
document.getElementById('stack-run').addEventListener('click', function () {
  runVisualize(
    document.getElementById('stack-editor').value,
    document.getElementById('stack-interactive-diagram'),
    document.getElementById('stack-interactive-callout'),
    document.getElementById('stack-py-status'),
    renderInteractiveStack, this,
    'stack-interactive-code', 'stack-editor'
  );
});