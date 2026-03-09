/* ═══════════════════════════════════════════════════════════
   sections/array.js — Array step mode + interactive setup
═══════════════════════════════════════════════════════════ */

const arrayCode = [
  "arr = []",
  "",
  "arr.append(10)",
  "arr.append(20)",
  "arr.append(30)",
  "arr.append(40)",
  "",
  "x = arr[0]",
  "y = arr[2]",
  "",
  "arr.pop()",
  "",
  "arr.insert(1, 99)",
];

const arrDiagramEl = document.getElementById('array-diagram');
const arrCalloutEl = document.getElementById('array-callout');

function renderArrayDiagram(arr, highlightIdx = -1) {
  arrDiagramEl.innerHTML = '';
  if (arr.length === 0) {
    arrDiagramEl.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">[ empty ]</span>';
    return;
  }
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;';
  arr.forEach((val, i) => {
    const box = document.createElement('div');
    box.className = 'arr-box';
    box.innerHTML = `<div class="arr-cell ${i===highlightIdx?'highlight':''}">${val}</div><div class="arr-idx">[${i}]</div>`;
    row.appendChild(box);
  });
  arrDiagramEl.appendChild(row);
}

const arraySteps = [
  { line:0,  arr:[], hl:-1, msg:"<code>arr = []</code> — initialize an empty list" },
  { line:2,  arr:[10], hl:0, msg:"<code>arr.append(10)</code> — add 10 at index 0" },
  { line:3,  arr:[10,20], hl:1, msg:"<code>arr.append(20)</code> — add 20 at index 1" },
  { line:4,  arr:[10,20,30], hl:2, msg:"<code>arr.append(30)</code> — add 30 at index 2" },
  { line:5,  arr:[10,20,30,40], hl:3, msg:"<code>arr.append(40)</code> — add 40 at index 3" },
  { line:7,  arr:[10,20,30,40], hl:0, msg:"<code>arr[0]</code> — access index 0, value is <strong>10</strong>" },
  { line:8,  arr:[10,20,30,40], hl:2, msg:"<code>arr[2]</code> — access index 2, value is <strong>30</strong>" },
  { line:10, arr:[10,20,30], hl:-1, msg:"<code>arr.pop()</code> — removes last element (40)" },
  { line:12, arr:[10,99,20,30], hl:1, msg:"<code>arr.insert(1, 99)</code> — inserts 99 at index 1, shifting others right" },
];

let arrState = { prevLine: null };

function resetArray() {
  arrState = { prevLine: null };
  renderCode('array-code', arrayCode);
  renderArrayDiagram([]);
  arrCalloutEl.innerHTML = 'Press <strong>Step →</strong> to begin';
}

renderCode('array-code', arrayCode);
renderArrayDiagram([]);

makeController(
  document.getElementById('array-step'),
  document.getElementById('array-reset'),
  document.getElementById('array-auto'),
  document.getElementById('array-step-num'),
  document.getElementById('array-step-total'),
  arraySteps,
  (i) => {
    const s = arraySteps[i];
    highlightLine('array-code', s.line, arrState.prevLine);
    arrState.prevLine = s.line;
    renderArrayDiagram(s.arr, s.hl);
    arrCalloutEl.innerHTML = s.msg;
  },
  resetArray
);

// Interactive
document.getElementById('array-run').addEventListener('click', function () {
  runVisualize(
    document.getElementById('array-editor').value,
    document.getElementById('array-interactive-diagram'),
    document.getElementById('array-interactive-callout'),
    document.getElementById('array-py-status'),
    renderInteractiveArray, this,
    'array-interactive-code', 'array-editor'
  );
});