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
    if (el) { el.classList.add('active'); el.scrollIntoView({ block: 'nearest' }); }
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
      autoTimer = setInterval(next, 900);
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
//  ARRAYS & LINKED LISTS
// ══════════════════════════════════════════════════════════════
const arrayCode = [
  "# Create an array (list in Python)",
  "arr = []",
  "",
  "# Append elements",
  "arr.append(10)   # arr = [10]",
  "arr.append(20)   # arr = [10, 20]",
  "arr.append(30)   # arr = [10, 20, 30]",
  "arr.append(40)   # arr = [10, 20, 30, 40]",
  "",
  "# Access by index",
  "x = arr[0]       # x = 10",
  "y = arr[2]       # y = 30",
  "",
  "# Remove last element",
  "arr.pop()        # arr = [10, 20, 30]",
  "",
  "# Insert at position",
  "arr.insert(1, 99) # arr = [10, 99, 20, 30]",
];

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

let currentArrayMode = 'array-tab';
const diagramEl = document.getElementById('array-diagram');
const calloutEl = document.getElementById('array-callout');

function renderArrayDiagram(arr, highlightIdx = -1) {
  diagramEl.innerHTML = '';
  if (arr.length === 0) {
    diagramEl.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">[ empty ]</span>';
    return;
  }
  arr.forEach((val, i) => {
    const box = document.createElement('div');
    box.className = 'arr-box';
    box.innerHTML = `
      <div class="arr-cell ${i === highlightIdx ? 'highlight' : ''}">${val}</div>
      <div class="arr-idx">[${i}]</div>
    `;
    diagramEl.appendChild(box);
  });
}

function renderLinkedDiagram(nodes, highlightIdx = -1) {
  diagramEl.innerHTML = '';
  if (nodes.length === 0) {
    diagramEl.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">head → None</span>';
    return;
  }
  const cont = document.createElement('div');
  cont.className = 'll-container';
  nodes.forEach((val, i) => {
    const node = document.createElement('div');
    node.className = 'll-node';
    const isLast = i === nodes.length - 1;
    node.innerHTML = `
      <div class="ll-cell ${i === highlightIdx ? 'highlight' : ''}">
        <div class="ll-val">${val}</div>
        <div class="ll-ptr">${isLast ? 'None' : '→'}</div>
      </div>
      ${!isLast ? '<div class="ll-arrow">→</div>' : ''}
    `;
    cont.appendChild(node);
  });
  const nullEl = document.createElement('div');
  nullEl.innerHTML = '';
  cont.appendChild(nullEl);
  diagramEl.appendChild(cont);
}

// Array steps
const arraySteps = [
  { line: 1, arr: [], hl: -1, msg: "Comment — describing what we're doing" },
  { line: 1, arr: [], hl: -1, msg: "<code>arr = []</code> — initialize an empty list" },
  { line: 3, arr: [], hl: -1, msg: "Comment — we'll append elements next" },
  { line: 4, arr: [10], hl: 0, msg: "<code>arr.append(10)</code> — add 10 at index 0" },
  { line: 5, arr: [10,20], hl: 1, msg: "<code>arr.append(20)</code> — add 20 at index 1" },
  { line: 6, arr: [10,20,30], hl: 2, msg: "<code>arr.append(30)</code> — add 30 at index 2" },
  { line: 7, arr: [10,20,30,40], hl: 3, msg: "<code>arr.append(40)</code> — add 40 at index 3" },
  { line: 9, arr: [10,20,30,40], hl: -1, msg: "Comment — we'll access elements by index" },
  { line: 10, arr: [10,20,30,40], hl: 0, msg: "<code>arr[0]</code> — access index 0, value is <strong>10</strong>" },
  { line: 11, arr: [10,20,30,40], hl: 2, msg: "<code>arr[2]</code> — access index 2, value is <strong>30</strong>" },
  { line: 13, arr: [10,20,30,40], hl: -1, msg: "Comment — removing the last element" },
  { line: 14, arr: [10,20,30], hl: -1, msg: "<code>arr.pop()</code> — removes last element (40). Array now has 3 items." },
  { line: 16, arr: [10,20,30], hl: -1, msg: "Comment — inserting at a specific position" },
  { line: 17, arr: [10,99,20,30], hl: 1, msg: "<code>arr.insert(1, 99)</code> — inserts 99 at index 1, shifting others right" },
];

// Linked list steps
const llSteps = [
  { line: 0, nodes: [], hl: -1, msg: "<code>class Node</code> — define a node with a value and pointer to next" },
  { line: 1, nodes: [], hl: -1, msg: "<code>__init__</code> — constructor: store val, set next = None" },
  { line: 5, nodes: [], hl: -1, msg: "<code>class LinkedList</code> — our linked list wrapper" },
  { line: 6, nodes: [], hl: -1, msg: "<code>self.head = None</code> — empty list: head points to nothing" },
  { line: 9, nodes: [], hl: -1, msg: "<code>append(val)</code> — method to add a node at the end" },
  { line: 19, nodes: [], hl: -1, msg: "<code>ll = LinkedList()</code> — create a new empty list" },
  { line: 20, nodes: [10], hl: 0, msg: "<code>ll.append(10)</code> — no head yet, so new node <em>becomes</em> the head" },
  { line: 21, nodes: [10,20], hl: 1, msg: "<code>ll.append(20)</code> — traverse to end, link 10 → 20" },
  { line: 22, nodes: [10,20,30], hl: 2, msg: "<code>ll.append(30)</code> — traverse to end, link 20 → 30 → None" },
];

let arrState = { arr: [], prevLine: null };
let llState  = { nodes: [], prevLine: null };

function resetArraySection() {
  arrState = { arr: [], prevLine: null };
  llState  = { nodes: [], prevLine: null };
  if (currentArrayMode === 'array-tab') {
    renderCode('array-code', arrayCode);
    renderArrayDiagram([]);
  } else {
    renderCode('array-code', linkedCode);
    renderLinkedDiagram([]);
  }
  calloutEl.innerHTML = 'Press <strong>Step →</strong> to begin';
}

function runArrayStep(i) {
  if (currentArrayMode === 'array-tab') {
    const s = arraySteps[i];
    highlightLine('array-code', s.line, arrState.prevLine);
    arrState.prevLine = s.line;
    arrState.arr = s.arr.slice();
    renderArrayDiagram(arrState.arr, s.hl);
    calloutEl.innerHTML = s.msg;
  } else {
    const s = llSteps[i];
    highlightLine('array-code', s.line, llState.prevLine);
    llState.prevLine = s.line;
    llState.nodes = s.nodes.slice();
    renderLinkedDiagram(llState.nodes, s.hl);
    calloutEl.innerHTML = s.msg;
  }
}

// Tab switching for arrays section
document.querySelectorAll('[data-tab="array-tab"], [data-tab="linked-tab"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab="array-tab"], [data-tab="linked-tab"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentArrayMode = btn.dataset.tab;
    resetArraySection();
    // re-bind steps
    const steps = currentArrayMode === 'array-tab' ? arraySteps : llSteps;
    document.getElementById('array-step-total').textContent = steps.length;
    document.getElementById('array-step-num').textContent = 0;
  });
});

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
    const steps = currentArrayMode === 'array-tab' ? arraySteps : llSteps;
    if (i < steps.length) runArrayStep(i);
  },
  resetArraySection
);

document.getElementById('array-step-total').textContent = arraySteps.length;


// ══════════════════════════════════════════════════════════════
//  STACKS & QUEUES
// ══════════════════════════════════════════════════════════════
const stackCode = [
  "# Stack — LIFO (Last In, First Out)",
  "stack = []",
  "",
  "# Push operations",
  "stack.append('A')  # push A",
  "stack.append('B')  # push B",
  "stack.append('C')  # push C",
  "",
  "# Peek at top",
  "top = stack[-1]    # top = 'C'",
  "",
  "# Pop operations",
  "stack.pop()        # remove C",
  "stack.pop()        # remove B",
  "",
  "# Stack is now: ['A']",
  "print(stack)       # ['A']",
];

const queueCode = [
  "from collections import deque",
  "",
  "# Queue — FIFO (First In, First Out)",
  "q = deque()",
  "",
  "# Enqueue (add to rear)",
  "q.append('X')      # queue: X",
  "q.append('Y')      # queue: X → Y",
  "q.append('Z')      # queue: X → Y → Z",
  "",
  "# Peek front",
  "front = q[0]       # front = 'X'",
  "",
  "# Dequeue (remove from front)",
  "q.popleft()        # removes X",
  "q.popleft()        # removes Y",
  "",
  "# Queue is now: deque(['Z'])",
  "print(q)           # deque(['Z'])",
];

let currentStackMode = 'stack-tab';
const stackDiagramEl = document.getElementById('stack-diagram');
const stackCalloutEl = document.getElementById('stack-callout');

function renderStackDiagram(items, topHighlight = false) {
  stackDiagramEl.innerHTML = '';
  if (items.length === 0) {
    stackDiagramEl.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">[ empty stack ]</span>';
    return;
  }
  const cont = document.createElement('div');
  cont.className = 'stack-container';
  items.forEach((v, i) => {
    const el = document.createElement('div');
    el.className = 'stack-item' + (i === items.length-1 ? ' top-item' : '');
    el.textContent = v;
    cont.appendChild(el);
  });
  const lbl = document.createElement('div');
  lbl.className = 'stack-label';
  lbl.textContent = '← TOP';
  cont.appendChild(lbl);
  stackDiagramEl.appendChild(cont);
}

function renderQueueDiagram(items) {
  stackDiagramEl.innerHTML = '';
  if (items.length === 0) {
    stackDiagramEl.innerHTML = '<span style="color:var(--text-dim);font-family:var(--mono);font-size:.8rem">[ empty queue ]</span>';
    return;
  }
  const cont = document.createElement('div');
  cont.className = 'queue-container';
  items.forEach((v, i) => {
    const el = document.createElement('div');
    el.className = 'queue-item'
      + (i === 0 ? ' front-item' : '')
      + (i === items.length-1 ? ' rear-item' : '');
    el.textContent = v;
    cont.appendChild(el);
  });
  stackDiagramEl.appendChild(cont);

  // labels
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:.5rem;margin-top:.5rem;font-family:var(--mono);font-size:.65rem;';
  row.innerHTML = `<span style="color:var(--accent2)">FRONT ↑</span><span style="flex:1"></span><span style="color:var(--accent)">↑ REAR</span>`;
  stackDiagramEl.appendChild(row);
}

const stackSteps = [
  { line:0, items:[], msg:"Comment — Stack uses LIFO order" },
  { line:1, items:[], msg:"<code>stack = []</code> — create an empty stack (Python list)" },
  { line:3, items:[], msg:"Comment — push operations" },
  { line:4, items:['A'], msg:"<code>stack.append('A')</code> — push 'A'. Stack: [A]" },
  { line:5, items:['A','B'], msg:"<code>stack.append('B')</code> — push 'B'. Stack: [A, B]" },
  { line:6, items:['A','B','C'], msg:"<code>stack.append('C')</code> — push 'C'. Stack: [A, B, C]" },
  { line:8, items:['A','B','C'], msg:"Comment — peek at top without removing" },
  { line:9, items:['A','B','C'], msg:"<code>stack[-1]</code> — peek at top element. Returns <strong>'C'</strong>" },
  { line:11, items:['A','B','C'], msg:"Comment — pop removes from the top" },
  { line:12, items:['A','B'], msg:"<code>stack.pop()</code> — removes 'C' (the top). Stack: [A, B]" },
  { line:13, items:['A'], msg:"<code>stack.pop()</code> — removes 'B'. Stack: [A]" },
  { line:15, items:['A'], msg:"Only 'A' remains in the stack" },
  { line:16, items:['A'], msg:"<code>print(stack)</code> → <strong>['A']</strong>" },
];

const queueSteps = [
  { line:0, items:[], msg:"<code>from collections import deque</code> — import deque for efficient queue" },
  { line:2, items:[], msg:"Comment — Queue uses FIFO order" },
  { line:3, items:[], msg:"<code>q = deque()</code> — create an empty double-ended queue" },
  { line:5, items:[], msg:"Comment — enqueue adds to the rear" },
  { line:6, items:['X'], msg:"<code>q.append('X')</code> — enqueue X at rear. Queue: [X]" },
  { line:7, items:['X','Y'], msg:"<code>q.append('Y')</code> — enqueue Y. Queue: [X → Y]" },
  { line:8, items:['X','Y','Z'], msg:"<code>q.append('Z')</code> — enqueue Z. Queue: [X → Y → Z]" },
  { line:10, items:['X','Y','Z'], msg:"Comment — peek at the front without removing" },
  { line:11, items:['X','Y','Z'], msg:"<code>q[0]</code> — peek at front. Returns <strong>'X'</strong>" },
  { line:13, items:['X','Y','Z'], msg:"Comment — dequeue removes from the front" },
  { line:14, items:['Y','Z'], msg:"<code>q.popleft()</code> — dequeue 'X' from front. Queue: [Y → Z]" },
  { line:15, items:['Z'], msg:"<code>q.popleft()</code> — dequeue 'Y'. Queue: [Z]" },
  { line:17, items:['Z'], msg:"Only 'Z' remains" },
  { line:18, items:['Z'], msg:"<code>print(q)</code> → <strong>deque(['Z'])</strong>" },
];

let stkState = { items: [], prevLine: null };
let qState   = { items: [], prevLine: null };

function resetStackSection() {
  stkState = { items: [], prevLine: null };
  qState   = { items: [], prevLine: null };
  if (currentStackMode === 'stack-tab') {
    renderCode('stack-code', stackCode);
    renderStackDiagram([]);
  } else {
    renderCode('stack-code', queueCode);
    renderQueueDiagram([]);
  }
  stackCalloutEl.innerHTML = 'Press <strong>Step →</strong> to begin';
}

function runStackStep(i) {
  if (currentStackMode === 'stack-tab') {
    const s = stackSteps[i];
    highlightLine('stack-code', s.line, stkState.prevLine);
    stkState.prevLine = s.line;
    renderStackDiagram(s.items);
    stackCalloutEl.innerHTML = s.msg;
  } else {
    const s = queueSteps[i];
    highlightLine('stack-code', s.line, qState.prevLine);
    qState.prevLine = s.line;
    renderQueueDiagram(s.items);
    stackCalloutEl.innerHTML = s.msg;
  }
}

document.querySelectorAll('[data-tab="stack-tab"], [data-tab="queue-tab"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab="stack-tab"], [data-tab="queue-tab"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentStackMode = btn.dataset.tab;
    resetStackSection();
    const steps = currentStackMode === 'stack-tab' ? stackSteps : queueSteps;
    document.getElementById('stack-step-total').textContent = steps.length;
    document.getElementById('stack-step-num').textContent = 0;
  });
});

renderCode('stack-code', stackCode);
renderStackDiagram([]);

makeController(
  document.getElementById('stack-step'),
  document.getElementById('stack-reset'),
  document.getElementById('stack-auto'),
  document.getElementById('stack-step-num'),
  document.getElementById('stack-step-total'),
  stackSteps,
  (i) => {
    const steps = currentStackMode === 'stack-tab' ? stackSteps : queueSteps;
    if (i < steps.length) runStackStep(i);
  },
  resetStackSection
);

document.getElementById('stack-step-total').textContent = stackSteps.length;


// ══════════════════════════════════════════════════════════════
//  BINARY SEARCH TREE
// ══════════════════════════════════════════════════════════════
const bstCode = [
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

// ── Array-based BST helpers ──────────────────────────────────
// treeArr: array of {data, left, right} where left/right are indices (-1 = none)
// highlightIdx: index of node currently being inserted/traversed

function computePositions(treeArr, rootIdx, W) {
  const positions = {};
  if (rootIdx < 0 || treeArr.length === 0) return positions;
  const YGAP = 72, startY = 40;
  function place(idx, x, y, spread) {
    positions[idx] = { x, y };
    const n = treeArr[idx];
    if (n.left !== -1) place(n.left, x - spread, y + YGAP, spread / 2);
    if (n.right !== -1) place(n.right, x + spread, y + YGAP, spread / 2);
  }
  place(rootIdx, W / 2, startY, W / 4);
  return positions;
}

function renderBSTDiagram(treeArr, highlightIdx = -1) {
  const diagramArea = document.getElementById('tree-diagram');

  // Remove old table if exists
  const oldTable = diagramArea.querySelector('.bst-array-table');
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
  table.className = 'bst-array-table';
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
const bstSteps = [
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
  const oldTable = diagramArea && diagramArea.querySelector('.bst-array-table');
  if (oldTable) oldTable.remove();
  renderCode('tree-code', bstCode);
  treeSVG.innerHTML = '';
  treeCallout.innerHTML = 'Press <strong>Step →</strong> to begin';
}

function runTreeStep(i) {
  const s = bstSteps[i];
  highlightLine('tree-code', s.line, treeState.prevLine);
  treeState.prevLine = s.line;
  renderBSTDiagram(s.tree, s.hl);
  treeCallout.innerHTML = s.msg;
}

renderCode('tree-code', bstCode);
treeSVG.innerHTML = '';

makeController(
  document.getElementById('tree-step'),
  document.getElementById('tree-reset'),
  document.getElementById('tree-auto'),
  document.getElementById('tree-step-num'),
  document.getElementById('tree-step-total'),
  bstSteps,
  (i) => { if (i < bstSteps.length) runTreeStep(i); },
  resetTreeSection
);

document.getElementById('tree-step-total').textContent = bstSteps.length;