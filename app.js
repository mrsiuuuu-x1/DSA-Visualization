/* ═══════════════════════════════════════════════════════════
   DSAvis — Data Structure Visualizer
   app.js
═══════════════════════════════════════════════════════════ */

// ── Navigation ───────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
  });
});


// ══════════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════════
function syntaxHL(raw) {
  // Strip inline comments, trim trailing whitespace
  const code = raw.replace(/#.*$/, '').trimEnd();
  // HTML-escape first
  let s = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Strings (single-quoted only, non-greedy)
  s = s.replace(/'([^']*)'/g, (_, inner) => `<span class="str">'${inner}'</span>`);
  // Keywords
  s = s.replace(/\b(def|class|return|if|else|elif|for|while|in|not|and|or|None|True|False|import|from|pass|self|break)\b/g, '<span class="kw">$1</span>');
  // Function calls
  s = s.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>');
  // Numbers (standalone, including -1)
  s = s.replace(/(^|[\s,=\[(<>!])(-?\d+)(?=[\s,\])<>!;+\-*\/]|$)/g, '$1<span class="num">$2</span>');
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

// ── Global animation speed (ms). Slider inverts: right = fast = low delay ──
let stepDelay = 900;

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


// ══════════════════════════════════════════════════════════════
//  ARRAY
// ══════════════════════════════════════════════════════════════
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
  { line:0, arr:[], hl:-1, msg:"<code>arr = []</code> — initialize an empty list" },
  { line:2, arr:[10], hl:0, msg:"<code>arr.append(10)</code> — add 10 at index 0" },
  { line:3, arr:[10,20], hl:1, msg:"<code>arr.append(20)</code> — add 20 at index 1" },
  { line:4, arr:[10,20,30], hl:2, msg:"<code>arr.append(30)</code> — add 30 at index 2" },
  { line:5, arr:[10,20,30,40], hl:3, msg:"<code>arr.append(40)</code> — add 40 at index 3" },
  { line:7, arr:[10,20,30,40], hl:0, msg:"<code>arr[0]</code> — access index 0, value is <strong>10</strong>" },
  { line:8, arr:[10,20,30,40], hl:2, msg:"<code>arr[2]</code> — access index 2, value is <strong>30</strong>" },
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
  document.getElementById('array-step'), document.getElementById('array-reset'),
  document.getElementById('array-auto'), document.getElementById('array-step-num'),
  document.getElementById('array-step-total'), arraySteps,
  (i) => {
    const s = arraySteps[i];
    highlightLine('array-code', s.line, arrState.prevLine);
    arrState.prevLine = s.line;
    renderArrayDiagram(s.arr, s.hl);
    arrCalloutEl.innerHTML = s.msg;
  }, resetArray
);


// ══════════════════════════════════════════════════════════════
//  LINKED LIST
// ══════════════════════════════════════════════════════════════
const linkedCode = [
  "class Node:",
  "    def __init__(self, val):",
  "        self.val = val",
  "        self.next = None",
  "",
  "class LinkedList:",
  "    def __init__(self):",
  "        self.head = None",
  "",
  "    def append(self, val):",
  "        new = Node(val)",
  "        if not self.head:",
  "            self.head = new",
  "            return",
  "        curr = self.head",
  "        while curr.next:",
  "            curr = curr.next",
  "        curr.next = new",
  "",
  "ll = LinkedList()",
  "ll.append(10)",
  "ll.append(20)",
  "ll.append(30)",
];

const llDiagramEl = document.getElementById('linked-diagram');
const llCalloutEl = document.getElementById('linked-callout');

function renderLinkedDiagram(nodes, highlightIdx = -1) {
  llDiagramEl.innerHTML = '';
  if (nodes.length === 0) {
    llDiagramEl.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">head → None</span>';
    return;
  }
  const cont = document.createElement('div');
  cont.className = 'll-container';
  nodes.forEach((val, i) => {
    const node = document.createElement('div');
    node.className = 'll-node';
    const isLast = i === nodes.length - 1;
    node.innerHTML = `
      <div class="ll-cell ${i===highlightIdx?'highlight':''}">
        <div class="ll-val">${val}</div>
        <div class="ll-ptr">${isLast ? 'None' : '→'}</div>
      </div>
      ${!isLast ? '<div class="ll-arrow">→</div>' : ''}`;
    cont.appendChild(node);
  });
  llDiagramEl.appendChild(cont);
}

const llSteps = [
  { line:0, nodes:[], hl:-1, msg:"<code>class Node</code> — each node holds a value and a <code>next</code> pointer" },
  { line:1, nodes:[], hl:-1, msg:"<code>__init__</code> — store val, set next = None" },
  { line:5, nodes:[], hl:-1, msg:"<code>class LinkedList</code> — wrapper class for the chain of nodes" },
  { line:6, nodes:[], hl:-1, msg:"<code>self.head = None</code> — empty list: head points to nothing" },
  { line:9, nodes:[], hl:-1, msg:"<code>append(val)</code> — method to add a node at the end" },
  { line:19, nodes:[], hl:-1, msg:"<code>ll = LinkedList()</code> — create a new empty linked list" },
  { line:20, nodes:[10], hl:0, msg:"<code>ll.append(10)</code> — head is None, so 10 becomes the head" },
  { line:21, nodes:[10,20], hl:1, msg:"<code>ll.append(20)</code> — traverse to end, link 10 → 20" },
  { line:22, nodes:[10,20,30], hl:2, msg:"<code>ll.append(30)</code> — traverse to end, link 20 → 30 → None" },
];

let llState = { prevLine: null };
function resetLinked() {
  llState = { prevLine: null };
  renderCode('linked-code', linkedCode);
  renderLinkedDiagram([]);
  llCalloutEl.innerHTML = 'Press <strong>Step →</strong> to begin';
}
renderCode('linked-code', linkedCode);
renderLinkedDiagram([]);
makeController(
  document.getElementById('linked-step'), document.getElementById('linked-reset'),
  document.getElementById('linked-auto'), document.getElementById('linked-step-num'),
  document.getElementById('linked-step-total'), llSteps,
  (i) => {
    const s = llSteps[i];
    highlightLine('linked-code', s.line, llState.prevLine);
    llState.prevLine = s.line;
    renderLinkedDiagram(s.nodes, s.hl);
    llCalloutEl.innerHTML = s.msg;
  }, resetLinked
);


// ══════════════════════════════════════════════════════════════
//  STACK
// ══════════════════════════════════════════════════════════════
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

// Renders stack + the array slots side by side
function renderStackDiagram(items, topIdx, highlightSlot = -1) {
  stackDiagramEl.innerHTML = '';

  // Left: visual stack
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
      const isTop = ri === 0;
      const el = document.createElement('div');
      el.className = 'stack-item' + (isTop ? ' top-item' : '');
      el.textContent = v;
      left.appendChild(el);
    });
  }

  // Right: TopOfStack indicator
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
  { line:0,  items:[], top:-1,  msg:"<code>Stack = [-1] * 30</code> — pre-allocate array of 30 slots, all -1" },
  { line:1,  items:[], top:-1,  msg:"<code>TopOfStack = -1</code> — -1 means the stack is empty" },
  { line:3,  items:[], top:-1,  msg:"<code>def Push(item)</code> — checks if full (TopOfStack > 29), then increments and inserts" },
  { line:12, items:[], top:-1,  msg:"<code>def Pop()</code> — checks if empty (TopOfStack == -1), then reads value and decrements" },
  { line:21, items:[10], top:0, msg:"<code>Push(10)</code> — TopOfStack: -1→0, Stack[0] = 10" },
  { line:22, items:[10,25], top:1, msg:"<code>Push(25)</code> — TopOfStack: 0→1, Stack[1] = 25" },
  { line:23, items:[10,25,7], top:2, msg:"<code>Push(7)</code> — TopOfStack: 1→2, Stack[2] = 7" },
  { line:24, items:[10,25,7,43], top:3, msg:"<code>Push(43)</code> — TopOfStack: 2→3, Stack[3] = 43" },
  { line:25, items:[10,25,7,43,18], top:4, msg:"<code>Push(18)</code> — TopOfStack: 3→4, Stack[4] = 18" },
  { line:27, items:[10,25,7,43], top:3, msg:"<code>Pop()</code> — value = Stack[4] = 18, TopOfStack: 4→3. Returns 18" },
  { line:28, items:[10,25,7], top:2, msg:"<code>Pop()</code> — value = Stack[3] = 43, TopOfStack: 3→2. Returns 43" },
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
  document.getElementById('stack-step'), document.getElementById('stack-reset'),
  document.getElementById('stack-auto'), document.getElementById('stack-step-num'),
  document.getElementById('stack-step-total'), stackSteps,
  (i) => {
    const s = stackSteps[i];
    highlightLine('stack-code', s.line, stkState.prevLine);
    stkState.prevLine = s.line;
    renderStackDiagram(s.items, s.top);
    stackCalloutEl.innerHTML = s.msg;
  }, resetStack
);


// ══════════════════════════════════════════════════════════════
//  QUEUE
// ══════════════════════════════════════════════════════════════
const queueCode = [
  "Queue = ['' for x in range(100)]",
  "HeadPointer = -1",
  "TailPointer = -1",
  "NumberItems = 0",
  "",
  "def EnQueue(val):",
  "    global Queue, HeadPointer, TailPointer, NumberItems",
  "    if NumberItems == 100:",
  "        return False",
  "    else:",
  "        if NumberItems == 0:",
  "            HeadPointer = 0",
  "            TailPointer = 0",
  "        else:",
  "            TailPointer += 1",
  "        Queue[TailPointer] = val",
  "        NumberItems += 1",
  "        return True",
  "",
  "def DeQueue():",
  "    global Queue, HeadPointer, TailPointer, NumberItems",
  "    if NumberItems == 0:",
  "        return 'False'",
  "    else:",
  "        item = Queue[HeadPointer]",
  "        NumberItems -= 1",
  "        if NumberItems == 0:",
  "            TailPointer = -1",
  "            HeadPointer = -1",
  "        HeadPointer += 1",
  "        return item",
  "",
  "EnQueue(15)",
  "EnQueue(32)",
  "EnQueue(8)",
  "EnQueue(61)",
  "EnQueue(27)",
  "",
  "DeQueue()",
  "DeQueue()",
];

const queueDiagramEl = document.getElementById('queue-diagram');
const queueCalloutEl = document.getElementById('queue-callout');

function renderQueueDiagram(items, head, tail, count) {
  queueDiagramEl.innerHTML = '';

  // Queue slots visual
  const top = document.createElement('div');
  top.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center;width:100%;';

  if (items.length === 0) {
    top.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">[ empty queue ]</span>';
  } else {
    items.forEach((v, i) => {
      const el = document.createElement('div');
      el.className = 'queue-item'
        + (i === 0 ? ' front-item' : '')
        + (i === items.length - 1 ? ' rear-item' : '');
      el.textContent = v;
      top.appendChild(el);
    });
  }
  queueDiagramEl.appendChild(top);

  // Pointer info row
  const info = document.createElement('div');
  info.style.cssText = 'display:flex;gap:1.5rem;margin-top:.6rem;font-family:var(--mono);font-size:.72rem;justify-content:center;';
  info.innerHTML = `
    <span style="color:var(--accent2)">Head: <strong>${head}</strong></span>
    <span style="color:var(--accent)">Tail: <strong>${tail}</strong></span>
    <span style="color:var(--text-dim)">Count: <strong>${count}</strong></span>
  `;
  queueDiagramEl.appendChild(info);
}

const queueSteps = [
  { line:0,  items:[], head:-1, tail:-1, count:0, msg:"<code>Queue = ['' for x in range(100)]</code> — pre-allocate 100 empty string slots" },
  { line:1,  items:[], head:-1, tail:-1, count:0, msg:"<code>HeadPointer = -1</code> — -1 means nothing in queue yet" },
  { line:2,  items:[], head:-1, tail:-1, count:0, msg:"<code>TailPointer = -1</code> — tail also -1 when empty" },
  { line:3,  items:[], head:-1, tail:-1, count:0, msg:"<code>NumberItems = 0</code> — queue is empty" },
  { line:5,  items:[], head:-1, tail:-1, count:0, msg:"<code>def EnQueue(val)</code> — if full (100 items) return False. First item sets both Head and Tail to 0; others just increment Tail" },
  { line:19, items:[], head:-1, tail:-1, count:0, msg:"<code>def DeQueue()</code> — if empty return 'False'. Read from Head, decrement count, increment HeadPointer" },
  { line:32, items:[15], head:0, tail:0, count:1, msg:"<code>EnQueue(15)</code> — NumberItems was 0 → Head=0, Tail=0. Queue[0]=15. Count: 1" },
  { line:33, items:[15,32], head:0, tail:1, count:2, msg:"<code>EnQueue(32)</code> — Tail: 0→1. Queue[1]=32. Count: 2" },
  { line:34, items:[15,32,8], head:0, tail:2, count:3, msg:"<code>EnQueue(8)</code> — Tail: 1→2. Queue[2]=8. Count: 3" },
  { line:35, items:[15,32,8,61], head:0, tail:3, count:4, msg:"<code>EnQueue(61)</code> — Tail: 2→3. Queue[3]=61. Count: 4" },
  { line:36, items:[15,32,8,61,27], head:0, tail:4, count:5, msg:"<code>EnQueue(27)</code> — Tail: 3→4. Queue[4]=27. Count: 5" },
  { line:38, items:[32,8,61,27], head:1, tail:4, count:4, msg:"<code>DeQueue()</code> — item = Queue[0] = 15. Head: 0→1. Count: 4. Returns 15" },
  { line:39, items:[8,61,27], head:2, tail:4, count:3, msg:"<code>DeQueue()</code> — item = Queue[1] = 32. Head: 1→2. Count: 3. Returns 32" },
];

let qState = { prevLine: null };
function resetQueue() {
  qState = { prevLine: null };
  renderCode('queue-code', queueCode);
  renderQueueDiagram([], -1, -1, 0);
  queueCalloutEl.innerHTML = 'Press <strong>Step →</strong> to begin';
}
renderCode('queue-code', queueCode);
renderQueueDiagram([], -1, -1, 0);
makeController(
  document.getElementById('queue-step'), document.getElementById('queue-reset'),
  document.getElementById('queue-auto'), document.getElementById('queue-step-num'),
  document.getElementById('queue-step-total'), queueSteps,
  (i) => {
    const s = queueSteps[i];
    highlightLine('queue-code', s.line, qState.prevLine);
    qState.prevLine = s.line;
    renderQueueDiagram(s.items, s.head, s.tail, s.count);
    queueCalloutEl.innerHTML = s.msg;
  }, resetQueue
);


// ══════════════════════════════════════════════════════════════
//  BINARY TREE
// ══════════════════════════════════════════════════════════════
const btCode = [
  "class Node:",
  "    def __init__(self, pdata):",
  "        self.__Data = pdata         #PRIVATE Data: INTEGER",
  "        self.__RightPointer = -1    #PRIVATE RightPointer: INTEGER",
  "        self.__LeftPointer = -1     #PRIVATE LeftPointer: INTEGER",
  "    def GetLeft(self):",
  "        return self.__LeftPointer",
  "    def GetData(self):",
  "        return self.__Data",
  "    def GetRight(self):",
  "        return self.__RightPointer",
  "    def SetLeft(self, pleftp):",
  "        self.__LeftPointer = pleftp",
  "    def SetData(self, pdata):",
  "        self.__Data = pdata",
  "    def SetRight(self, prightp):",
  "        self.__RightPointer = prightp",
  "",
  "class TreeClass:",
  "    def __init__(self):",
  "        self.__FirstNode = -1",
  "        self.__NumberNodes = 0",
  "        self.__Tree = [Node(-1) for x in range(20)]",
  "",
  "    def InsertNode(self, NewNode):",
  "        if self.__NumberNodes == 0:",
  "            self.__Tree[0] = NewNode",
  "            self.__FirstNode = 0",
  "            self.__NumberNodes += 1",
  "        else:",
  "            self.__Tree[self.__NumberNodes] = NewNode",
  "            current = self.__FirstNode",
  "            while True:",
  "                if self.__Tree[current].GetData() < NewNode.GetData():",
  "                    if self.__Tree[current].GetRight() == -1:",
  "                        self.__Tree[current].SetRight(self.__NumberNodes)",
  "                        self.__NumberNodes += 1",
  "                        break",
  "                    else:",
  "                        current = self.__Tree[current].GetRight()",
  "                elif self.__Tree[current].GetData() > NewNode.GetData():",
  "                    if self.__Tree[current].GetLeft() == -1:",
  "                        self.__Tree[current].SetLeft(self.__NumberNodes)",
  "                        self.__NumberNodes += 1",
  "                        break",
  "                    else:",
  "                        current = self.__Tree[current].GetLeft()",
  "",
  "    def OutputTree(self):",
  "        if self.__NumberNodes == 0:",
  "            print('No Nodes')",
  "        else:",
  "            for x in range(self.__NumberNodes):",
  "                L = self.__Tree[x].GetLeft()",
  "                D = self.__Tree[x].GetData()",
  "                R = self.__Tree[x].GetRight()",
  "                print(str(L) + ',' + str(D) + ',' + str(R))",
  "",
  "TheTree = TreeClass()",
  "TheTree.InsertNode(Node(10))",
  "TheTree.InsertNode(Node(11))",
  "TheTree.InsertNode(Node(5))",
  "TheTree.InsertNode(Node(1))",
  "TheTree.InsertNode(Node(20))",
  "TheTree.InsertNode(Node(7))",
  "TheTree.InsertNode(Node(15))",
  "TheTree.OutputTree()",
];


const treeSVG = document.getElementById('tree-svg');
const treeCallout = document.getElementById('tree-callout');

// ── Array-based BT helpers ──────────────────────────────────
// treeArr: array of {data, left, right} where left/right are indices (-1 = none)
// highlightIdx: index of node currently being inserted/traversed

function computePositions(treeArr, rootIdx, W) {
  const positions = {};
  if (rootIdx < 0 || treeArr.length === 0) return positions;
  const YGAP = 72, startY = 40;
  function place(idx, x, y, spread) {
    if (idx < 0 || idx >= treeArr.length || !treeArr[idx]) return;
    if (positions[idx]) return;          // prevent infinite loops on bad data
    positions[idx] = { x, y };
    const n = treeArr[idx];
    if (n.left !== -1) place(n.left, x - spread, y + YGAP, spread / 2);
    if (n.right !== -1) place(n.right, x + spread, y + YGAP, spread / 2);
  }
  place(rootIdx, W / 2, startY, W / 4);
  return positions;
}

function renderBTDiagram(treeArr, highlightIdx = -1) {
  const diagramArea = document.getElementById('tree-diagram');

  // Remove old table if exists
  const oldTable = diagramArea.querySelector('.bt-array-table');
  if (oldTable) oldTable.remove();

  treeSVG.innerHTML = '';
  if (treeArr.length === 0) return;

  const W = treeSVG.clientWidth || 480;
  const positions = computePositions(treeArr, 0, W);

  // Draw edges
  treeArr.forEach((n, i) => {
    [[n.left, 'left'],[n.right, 'right']].forEach(([childIdx]) => {
      if (childIdx === -1) return;
      const p = positions[i], c = positions[childIdx];
      if (!p || !c) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',p.x); line.setAttribute('y1',p.y);
      line.setAttribute('x2',c.x); line.setAttribute('y2',c.y);
      line.setAttribute('class','tree-edge'+(childIdx===highlightIdx?' active':''));
      treeSVG.appendChild(line);
    });
  });

  // Draw nodes
  treeArr.forEach((n, i) => {
    const pos = positions[i];
    if (!pos) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx',pos.x); circle.setAttribute('cy',pos.y); circle.setAttribute('r',22);
    circle.setAttribute('class','tree-circle'+(i===highlightIdx?' highlight':''));
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x',pos.x); text.setAttribute('y',pos.y);
    text.setAttribute('class','tree-text'); text.textContent = n.data;
    // Index label above node
    const idxLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
    idxLabel.setAttribute('x',pos.x); idxLabel.setAttribute('y',pos.y - 28);
    idxLabel.setAttribute('class','tree-text');
    idxLabel.style.fontSize = '10px'; idxLabel.style.fill = 'var(--text-dim)';
    idxLabel.textContent = '['+i+']';
    g.appendChild(circle); g.appendChild(text); g.appendChild(idxLabel);
    treeSVG.appendChild(g);
  });

  // Draw array table below SVG
  const table = document.createElement('div');
  table.className = 'bt-array-table';
  table.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-top:8px;width:100%;overflow-x:auto;';

  // Header row
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.65rem;color:var(--text-dim);';
  header.innerHTML = '<div style="width:32px;text-align:center">idx</div>'
    + treeArr.map((_,i)=>`<div style="width:44px;text-align:center">[${i}]</div>`).join('');
  table.appendChild(header);

  // Left pointer row
  const leftRow = document.createElement('div');
  leftRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.7rem;';
  leftRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">L</div>'
    + treeArr.map((n,i)=>`<div style="width:44px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:${i===highlightIdx?'var(--accent2)':'var(--text-dim)'}">${n.left}</div>`).join('');
  table.appendChild(leftRow);

  // Data row
  const dataRow = document.createElement('div');
  dataRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.75rem;font-weight:700;';
  dataRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">D</div>'
    + treeArr.map((n,i)=>`<div style="width:44px;text-align:center;padding:4px 0;background:var(--surface2);border-radius:4px;border:1px solid ${i===highlightIdx?'var(--accent)':'var(--border)'};color:${i===highlightIdx?'var(--accent)':'var(--text)'}">${n.data}</div>`).join('');
  table.appendChild(dataRow);

  // Right pointer row
  const rightRow = document.createElement('div');
  rightRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.7rem;';
  rightRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">R</div>'
    + treeArr.map((n,i)=>`<div style="width:44px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:${i===highlightIdx?'var(--accent2)':'var(--text-dim)'}">${n.right}</div>`).join('');
  table.appendChild(rightRow);

  diagramArea.appendChild(table);
}

// Graph BFS layout — fixed positions
const graphNodes = ['A','B','C','D','E','F'];
const graphEdges = [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['E','F']];
const graphPos = { A:{x:250,y:40}, B:{x:130,y:110}, C:{x:370,y:110}, D:{x:60,y:200}, E:{x:200,y:200}, F:{x:340,y:200} };

function renderGraphDiagram(visited, current = null) {
  treeSVG.innerHTML = '';
  // edges
  graphEdges.forEach(([a,b]) => {
    const pa = graphPos[a], pb = graphPos[b];
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',pa.x); line.setAttribute('y1',pa.y);
    line.setAttribute('x2',pb.x); line.setAttribute('y2',pb.y);
    line.setAttribute('class','tree-edge'+(visited.includes(a)&&visited.includes(b)?' active':''));
    treeSVG.appendChild(line);
  });
  // nodes
  graphNodes.forEach(n => {
    const pos = graphPos[n];
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',pos.x); c.setAttribute('cy',pos.y); c.setAttribute('r',22);
    c.setAttribute('class','tree-circle'+(n===current?' highlight':visited.includes(n)?' visited':''));
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',pos.x); t.setAttribute('y',pos.y);
    t.setAttribute('class','tree-text'); t.textContent = n;
    g.appendChild(c); g.appendChild(t);
    treeSVG.appendChild(g);
  });
}

// Each step: {line, tree:[], hl:index, msg}
// tree is array of {data, left, right} — matches __Tree array in code
const btSteps = [
  { line:0,  tree:[], hl:-1, msg:"<code>class Node</code> — each Node stores <strong>__Data</strong>, <strong>__LeftPointer</strong>, <strong>__RightPointer</strong> (all private, default -1)" },
  { line:5,  tree:[], hl:-1, msg:"<code>GetLeft / GetData / GetRight</code> — public getters allow read-only access to private fields" },
  { line:11, tree:[], hl:-1, msg:"<code>SetLeft / SetData / SetRight</code> — public setters allow controlled modification of private fields" },
  { line:18, tree:[], hl:-1, msg:"<code>class TreeClass</code> — stores nodes in a fixed array <code>__Tree[20]</code>. Uses <strong>integer indices</strong> as pointers instead of object references" },
  { line:19, tree:[], hl:-1, msg:"<code>__FirstNode = -1</code>, <code>__NumberNodes = 0</code> — tree is empty. __Tree is pre-filled with dummy Node(-1) objects" },
  { line:57, tree:[], hl:-1, msg:"<code>TheTree = TreeClass()</code> — create the tree" },

  // Insert 10 — becomes root
  { line:58, tree:[], hl:-1, msg:"<code>InsertNode(Node(10))</code> — __NumberNodes is 0, so 10 becomes the root at index 0" },
  { line:25, tree:[], hl:-1, msg:"<code>if self.__NumberNodes == 0</code> — True! First node ever inserted" },
  { line:26, tree:[{data:10,left:-1,right:-1}], hl:0, msg:"<code>__Tree[0] = NewNode</code> — place Node(10) at index 0" },
  { line:27, tree:[{data:10,left:-1,right:-1}], hl:0, msg:"<code>__FirstNode = 0</code> — root is at index 0. <code>__NumberNodes</code> becomes 1" },

  // Insert 11
  { line:59, tree:[{data:10,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(11))</code> — tree is not empty, traverse to find position" },
  { line:30, tree:[{data:10,left:-1,right:-1},{data:11,left:-1,right:-1}], hl:1, msg:"<code>__Tree[1] = Node(11)</code> — place at next free index (1). Now traverse from root" },
  { line:33, tree:[{data:10,left:-1,right:-1},{data:11,left:-1,right:-1}], hl:0, msg:"<code>current = 0</code> (root). Check: Tree[0].GetData()=10 &lt; 11? Yes → go right" },
  { line:34, tree:[{data:10,left:-1,right:-1},{data:11,left:-1,right:-1}], hl:0, msg:"<code>GetRight() == -1</code> → right is empty! Call <code>SetRight(1)</code>" },
  { line:35, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1}], hl:1, msg:"<code>Tree[0].SetRight(1)</code> — node 10's right pointer now = 1. <code>__NumberNodes</code> = 2. Break!" },

  // Insert 5
  { line:60, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(5))</code> — traverse from root to find correct position" },
  { line:30, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:2, msg:"<code>__Tree[2] = Node(5)</code> — placed at index 2. Traversing from root..." },
  { line:40, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:0, msg:"<code>Tree[0].GetData()=10 > 5</code> → go left. <code>GetLeft()==-1</code> → empty! <code>SetLeft(2)</code>" },
  { line:43, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:2, msg:"<code>Tree[0].SetLeft(2)</code> — node 10's left pointer = 2. <code>__NumberNodes</code> = 3. Break!" },

  // Insert 1
  { line:61, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(1))</code> — 1 &lt; 10 → go left to [2]. 1 &lt; 5 → go left. Empty → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1},{data:1,left:-1,right:-1}], hl:3, msg:"<code>__Tree[3] = Node(1)</code>. Traverse: root(10)→left→[2](5)→left==-1 → SetLeft(3)" },
  { line:43, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:3,right:-1},{data:1,left:-1,right:-1}], hl:3, msg:"<code>Tree[2].SetLeft(3)</code> — node 5's left pointer = 3. <code>__NumberNodes</code> = 4" },

  // Insert 20
  { line:62, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:3,right:-1},{data:1,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(20))</code> — 20 > 10 → right→[1](11). 20 > 11 → right==-1 → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1}], hl:4, msg:"<code>__Tree[4] = Node(20)</code>. Traverse: [0](10)→right→[1](11)→right==-1 → SetRight(4)" },
  { line:35, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1}], hl:4, msg:"<code>Tree[1].SetRight(4)</code> — node 11's right pointer = 4. <code>__NumberNodes</code> = 5" },

  // Insert 7
  { line:63, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(7))</code> — 7 &lt; 10 → left→[2](5). 7 > 5 → right==-1 → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1}], hl:5, msg:"<code>__Tree[5] = Node(7)</code>. Traverse: [0]→left→[2](5)→right==-1 → SetRight(5)" },
  { line:35, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1}], hl:5, msg:"<code>Tree[2].SetRight(5)</code> — node 5's right pointer = 5. <code>__NumberNodes</code> = 6" },

  // Insert 15
  { line:64, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(15))</code> — 15 > 10 → right→[1](11). 15 > 11 → right→[4](20). 15 &lt; 20 → left==-1 → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1},{data:15,left:-1,right:-1}], hl:6, msg:"<code>__Tree[6] = Node(15)</code>. Traverse: [0]→[1]→[4](20)→left==-1 → SetLeft(6)" },
  { line:43, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:6,right:-1},{data:7,left:-1,right:-1},{data:15,left:-1,right:-1}], hl:6, msg:"<code>Tree[4].SetLeft(6)</code> — node 20's left = 6. <code>__NumberNodes</code> = 7. All 7 nodes inserted!" },

  // OutputTree
  { line:48, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:6,right:-1},{data:7,left:-1,right:-1},{data:15,left:-1,right:-1}], hl:-1,
    msg:"<code>OutputTree()</code> — prints each node as <strong>Left,Data,Right</strong>:<br>2,10,1 | -1,11,4 | 3,5,5 | -1,1,-1 | 6,20,-1 | -1,7,-1 | -1,15,-1" },
];

let treeState = { prevLine: null };

function resetTreeSection() {
  treeState = { prevLine: null };
  const diagramArea = document.getElementById('tree-diagram');
  const oldTable = diagramArea && diagramArea.querySelector('.bt-array-table');
  if (oldTable) oldTable.remove();
  renderCode('tree-code', btCode);
  treeSVG.innerHTML = '';
  treeCallout.innerHTML = 'Press <strong>Step →</strong> to begin';
}

function runTreeStep(i) {
  const s = btSteps[i];
  highlightLine('tree-code', s.line, treeState.prevLine);
  treeState.prevLine = s.line;
  renderBTDiagram(s.tree, s.hl);
  treeCallout.innerHTML = s.msg;
}

renderCode('tree-code', btCode);
treeSVG.innerHTML = '';

makeController(
  document.getElementById('tree-step'),
  document.getElementById('tree-reset'),
  document.getElementById('tree-auto'),
  document.getElementById('tree-step-num'),
  document.getElementById('tree-step-total'),
  btSteps,
  (i) => { if (i < btSteps.length) runTreeStep(i); },
  resetTreeSection
);


document.getElementById('tree-step-total').textContent = btSteps.length;




// ══════════════════════════════════════════════════════════════
//  INTERACTIVE MODE — Skulpt Python + @visualize tag
// ══════════════════════════════════════════════════════════════

// ── Mode toggle ───────────────────────────────────────────────
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
  });
}
setupModeToggle('array');
setupModeToggle('linkedlist');
setupModeToggle('stack');
setupModeToggle('queue');
setupModeToggle('tree');

// Mark all as ready immediately — Skulpt needs no loading
document.querySelectorAll('.pyodide-status').forEach(el => {
  el.textContent = '✓ Python ready';
  el.classList.add('ready');
});

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

// ── Core visualizer ───────────────────────────────────────────
// Instruments user code to snapshot watched variable after each line,
// then collects results via print() and animates them.
async function runVisualize(userCode, diagramEl, calloutEl, statusEl, renderFn) {
  // 1. Extract @visualize variable name
  const tagMatch = userCode.match(/#\s*@visualize\s+(\w+)/);
  if (!tagMatch) {
    calloutEl.innerHTML = `<span style="color:#ff5a5a">Add <code># @visualize YourVarName</code> anywhere in your code.</span>`;
    return;
  }
  const varName = tagMatch[1];

  // 2. Instrument: after every executable line, print a JSON snapshot
  const lines = userCode.split('\n');
  const out = [];
  // Pure-Python JSON serializer (Skulpt does not support the json module)
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
  // Deep-copy helper so nested lists (e.g. tree arrays) are snapshotted by value
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

  for (const line of lines) {
    out.push(line);
    const s = line.trim();
    if (!s || s.startsWith('#') || /^(def |class |if |elif |else:|for |while |with |try:|except|finally:|return\b|pass\b|break\b|continue\b)/.test(s)) continue;
    // Get leading whitespace to preserve indentation inside functions/blocks
    const indent = line.match(/^(\s*)/)[0];
    // After each executable line, try to snapshot the target variable
    out.push(
      `${indent}try:\n` +
      `${indent}  _tmp = _deepcopy(${varName})\n` +
      `${indent}  _snapshots.append(_tmp)\n` +
      `${indent}  _labels.append(${JSON.stringify(s.slice(0, 60))})\n` +
      `${indent}except:\n` +
      `${indent}  pass`
    );
  }
  // Print results as JSON at the end
  out.push('print(_dumps({"snapshots": _snapshots, "labels": _labels}))');

  statusEl.textContent = 'Running...';
  statusEl.className = 'pyodide-status';

  try {
    const output = await runSkulpt(out.join('\n'));

    // Parse the last line of output as JSON
    const lastLine = output.trim().split('\n').pop();
    const { snapshots: rawSnaps, labels: rawLabels } = JSON.parse(lastLine);

    // Deduplicate consecutive identical snapshots
    const steps = [];
    let prev = null;
    for (let i = 0; i < rawSnaps.length; i++) {
      const key = JSON.stringify(rawSnaps[i]);
      if (key !== prev) {
        steps.push({ snap: rawSnaps[i], label: rawLabels[i] });
        prev = key;
      }
    }

    if (steps.length === 0) {
      calloutEl.innerHTML = `<span style="color:#ff5a5a">No changes on <code>${varName}</code>. Check the variable name matches exactly.</span>`;
      statusEl.textContent = '✓ Python ready';
      statusEl.classList.add('ready');
      return;
    }

    statusEl.textContent = '✓ Python ready';
    statusEl.classList.add('ready');

    let i = 0;
    function play() {
      if (i >= steps.length) {
        const last = steps[steps.length - 1].snap.filter(v => v !== -1 && v !== '' && v !== null);
        calloutEl.innerHTML = `✅ Done — <strong>${varName}</strong> has ${last.length} item(s)`;
        return;
      }
      const { snap, label } = steps[i];
      renderFn(diagramEl, snap, varName);
      calloutEl.innerHTML = `<code>${label}</code>`;
      i++;
      setTimeout(play, stepDelay);
    }
    play();

  } catch (e) {
    statusEl.textContent = '✗ Error';
    statusEl.classList.add('error');
    const msg = (e.toString().match(/SyntaxError.*|NameError.*|TypeError.*|ValueError.*/) || [e.toString()])[0];
    calloutEl.innerHTML = `<span style="color:#ff5a5a">Error: ${msg}</span>`;
  }
}

// ── Render helpers ────────────────────────────────────────────

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
  // snap is the raw tree array: each element is [left, data, right]
  // Filter to only valid nodes (not [-1, -1, -1])
  const treeArr = [];
  for (let i = 0; i < snap.length; i++) {
    const item = snap[i];
    if (Array.isArray(item) && !(item[0] === -1 && item[1] === -1 && item[2] === -1)) {
      treeArr.push({ data: item[1], left: item[0], right: item[2] });
    } else {
      break; // stop at first unused slot
    }
  }

  if (treeArr.length === 0) {
    diagramEl.innerHTML = '<span class="diagram-placeholder">[ empty tree ]</span>';
    return;
  }

  // SVG tree visualization
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '240');
  svg.style.overflow = 'visible';

  const W = diagramEl.clientWidth || 480;
  const positions = computePositions(treeArr, 0, W);

  // Draw edges
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

  // Draw nodes
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

  // Array table below SVG
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

// ── Wire up Run buttons ───────────────────────────────────────
document.getElementById('array-run').addEventListener('click', () => {
  runVisualize(
    document.getElementById('array-editor').value,
    document.getElementById('array-interactive-diagram'),
    document.getElementById('array-interactive-callout'),
    document.getElementById('array-py-status'),
    renderInteractiveArray
  );
});

document.getElementById('stack-run').addEventListener('click', () => {
  runVisualize(
    document.getElementById('stack-editor').value,
    document.getElementById('stack-interactive-diagram'),
    document.getElementById('stack-interactive-callout'),
    document.getElementById('stack-py-status'),
    renderInteractiveStack
  );
});

document.getElementById('queue-run').addEventListener('click', () => {
  runVisualize(
    document.getElementById('queue-editor').value,
    document.getElementById('queue-interactive-diagram'),
    document.getElementById('queue-interactive-callout'),
    document.getElementById('queue-py-status'),
    renderInteractiveQueue
  );
});

document.getElementById('linkedlist-run').addEventListener('click', () => {
  runVisualize(
    document.getElementById('linkedlist-editor').value,
    document.getElementById('linkedlist-interactive-diagram'),
    document.getElementById('linkedlist-interactive-callout'),
    document.getElementById('linkedlist-py-status'),
    renderInteractiveLinkedList
  );
});

document.getElementById('tree-run').addEventListener('click', () => {
  runVisualize(
    document.getElementById('tree-editor').value,
    document.getElementById('tree-interactive-diagram'),
    document.getElementById('tree-interactive-callout'),
    document.getElementById('tree-py-status'),
    renderInteractiveTree
  );
});

// ══════════════════════════════════════════════════════════════
//  SPEED SLIDER — injected into every .controls row
// ══════════════════════════════════════════════════════════════
function injectSpeedSliders() {
  document.querySelectorAll('.controls').forEach(row => {
    // Don't double-inject
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
      // Invert: slider right (2000) = fast = low delay (200ms)
      stepDelay = 2200 - Number(e.target.value);
      // Keep all sliders in sync
      document.querySelectorAll('.speed-slider').forEach(s => { s.value = e.target.value; });
    });
  });
}

injectSpeedSliders();