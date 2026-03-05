document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.section).classList.add('active');
  });
});


//  UTILITIES
function syntaxHL(code) {
  const keywords = /\b(def|class|return|if|else|elif|for|while|in|not|and|or|None|True|False|import|from|pass|self|append|pop|insert|remove|print)\b/g;
  const strings = /(\".*?\"|'.*?')/g;
  const nums = /\b(\d+)\b/g;
  const comments = /(#.*$)/gm;
  const fns = /\b([a-z_][a-z0-9_]*)\s*(?=\()/g;

  return code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(comments, '<span class="cmt">$1</span>')
    .replace(strings, '<span class="str">$1</span>')
    .replace(keywords, '<span class="kw">$1</span>')
    .replace(fns, '<span class="fn">$1</span>')
    .replace(nums, '<span class="num">$1</span>');
}

function renderCode(preId, lines) {
  const pre = document.getElementById(preId);
  pre.innerHTML = lines.map((l, i) =>
    `<span class="code-line" data-ln="${i+1}" id="${preId}-line-${i}">${syntaxHL(l)}</span>`
  ).join('\n');
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


//  ARRAYS & LINKED LISTS
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


//  STACKS & QUEUES
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


//  TREES & GRAPHS
const bstCode = [
  "class Node:",
  "    def __init__(self, val):",
  "        self.val = val",
  "        self.left = None",
  "        self.right = None",
  "",
  "class BST:",
  "    def __init__(self):",
  "        self.root = None",
  "",
  "    def insert(self, val):",
  "        node = Node(val)",
  "        if not self.root:",
  "            self.root = node",
  "            return",
  "        curr = self.root",
  "        while True:",
  "            if val < curr.val:",
  "                if not curr.left:",
  "                    curr.left = node; return",
  "                curr = curr.left",
  "            else:",
  "                if not curr.right:",
  "                    curr.right = node; return",
  "                curr = curr.right",
  "",
  "bst = BST()",
  "bst.insert(50)   # root",
  "bst.insert(30)   # left of 50",
  "bst.insert(70)   # right of 50",
  "bst.insert(20)   # left of 30",
  "bst.insert(40)   # right of 30",
];

const graphCode = [
  "from collections import deque",
  "",
  "graph = {",
  "    'A': ['B', 'C'],",
  "    'B': ['A', 'D', 'E'],",
  "    'C': ['A', 'F'],",
  "    'D': ['B'],",
  "    'E': ['B', 'F'],",
  "    'F': ['C', 'E']",
  "}",
  "",
  "def bfs(graph, start):",
  "    visited = set()",
  "    queue = deque([start])",
  "    visited.add(start)",
  "    order = []",
  "",
  "    while queue:",
  "        node = queue.popleft()",
  "        order.append(node)",
  "        for neighbor in graph[node]:",
  "            if neighbor not in visited:",
  "                visited.add(neighbor)",
  "                queue.append(neighbor)",
  "",
  "    return order",
  "",
  "result = bfs(graph, 'A')",
  "# result = ['A','B','C','D','E','F']",
];

let currentTreeMode = 'bst-tab';
const treeSVG = document.getElementById('tree-svg');
const treeCallout = document.getElementById('tree-callout');

// BST layout helpers
function computeBSTLayout(nodes) {
  // nodes: [{val, parent, dir}]
  const W = treeSVG.clientWidth || 500;
  const positions = {};
  if (nodes.length === 0) return positions;

  // Build tree structure
  const tree = {};
  nodes.forEach(n => { tree[n.val] = { val: n.val, left: null, right: null }; });
  nodes.forEach(n => {
    if (n.parent !== null) {
      if (n.dir === 'left') tree[n.parent].left = n.val;
      else tree[n.parent].right = n.val;
    }
  });

  const root = nodes[0].val;
  const YGAP = 70, startY = 44;

  function place(val, x, y, spread) {
    positions[val] = { x, y };
    const node = tree[val];
    if (node.left !== null) place(node.left, x - spread, y + YGAP, spread / 2);
    if (node.right !== null) place(node.right, x + spread, y + YGAP, spread / 2);
  }

  place(root, W / 2, startY, W / 4.5);
  return positions;
}

function renderBSTDiagram(insertedNodes, highlightVal = null) {
  treeSVG.innerHTML = '';
  if (insertedNodes.length === 0) return;

  const positions = computeBSTLayout(insertedNodes);

  // draw edges first
  insertedNodes.forEach(n => {
    if (n.parent !== null) {
      const p = positions[n.parent];
      const c = positions[n.val];
      if (!p || !c) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p.x); line.setAttribute('y1', p.y);
      line.setAttribute('x2', c.x); line.setAttribute('y2', c.y);
      line.setAttribute('class', 'tree-edge' + (n.val === highlightVal ? ' active' : ''));
      treeSVG.appendChild(line);
    }
  });

  // draw nodes
  insertedNodes.forEach(n => {
    const pos = positions[n.val];
    if (!pos) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'tree-node-group');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', 22);
    circle.setAttribute('class', 'tree-circle' + (n.val === highlightVal ? ' highlight' : ''));
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
    text.setAttribute('class', 'tree-text');
    text.textContent = n.val;
    g.appendChild(circle); g.appendChild(text);
    treeSVG.appendChild(g);
  });
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

// BST steps: [{line, nodes:[], hl, msg}]
const bstSteps = [
  { line:0, nodes:[], hl:null, msg:"<code>class Node</code> — each node stores a val, left pointer, right pointer" },
  { line:6, nodes:[], hl:null, msg:"<code>class BST</code> — our Binary Search Tree wrapper" },
  { line:7, nodes:[], hl:null, msg:"<code>self.root = None</code> — tree starts empty" },
  { line:10, nodes:[], hl:null, msg:"<code>insert(val)</code> — method to insert a value maintaining BST property" },
  { line:26, nodes:[], hl:null, msg:"<code>bst = BST()</code> — create the tree" },
  { line:27, nodes:[{val:50,parent:null,dir:null}], hl:50, msg:"<code>bst.insert(50)</code> — tree is empty, 50 becomes the root" },
  { line:28, nodes:[{val:50,parent:null,dir:null},{val:30,parent:50,dir:'left'}], hl:30, msg:"<code>bst.insert(30)</code> — 30 < 50, so go left. Left is empty → insert here" },
  { line:29, nodes:[{val:50,parent:null,dir:null},{val:30,parent:50,dir:'left'},{val:70,parent:50,dir:'right'}], hl:70, msg:"<code>bst.insert(70)</code> — 70 > 50, so go right. Right is empty → insert here" },
  { line:30, nodes:[{val:50,parent:null,dir:null},{val:30,parent:50,dir:'left'},{val:70,parent:50,dir:'right'},{val:20,parent:30,dir:'left'}], hl:20, msg:"<code>bst.insert(20)</code> — 20 < 50 → go left. 20 < 30 → go left. Empty → insert" },
  { line:31, nodes:[{val:50,parent:null,dir:null},{val:30,parent:50,dir:'left'},{val:70,parent:50,dir:'right'},{val:20,parent:30,dir:'left'},{val:40,parent:30,dir:'right'}], hl:40, msg:"<code>bst.insert(40)</code> — 40 < 50 → left. 40 > 30 → right. Empty → insert" },
];

const bfsOrder = ['A','B','C','D','E','F'];
const graphSteps = [
  { line:0, visited:[], cur:null, msg:"Import deque for the BFS queue" },
  { line:2, visited:[], cur:null, msg:"<code>graph = {...}</code> — adjacency list: each key maps to its neighbors" },
  { line:11, visited:[], cur:null, msg:"<code>def bfs(graph, start)</code> — BFS explores level by level" },
  { line:12, visited:[], cur:null, msg:"<code>visited = set()</code> — track visited nodes so we don't loop" },
  { line:13, visited:[], cur:'A', msg:"<code>queue = deque(['A'])</code> — start BFS from 'A'" },
  { line:14, visited:['A'], cur:'A', msg:"<code>visited.add('A')</code> — mark A as visited" },
  { line:17, visited:['A'], cur:'A', msg:"<code>while queue</code> — loop until no more nodes to visit" },
  { line:18, visited:['A'], cur:'A', msg:"<code>node = queue.popleft()</code> — dequeue A, process it" },
  { line:19, visited:['A'], cur:'A', msg:"<code>order.append('A')</code> — A added to result. Enqueue B, C" },
  { line:18, visited:['A','B'], cur:'B', msg:"Dequeue B — explore B's unvisited neighbors: D, E" },
  { line:19, visited:['A','B'], cur:'B', msg:"B added to result. Enqueue D, E" },
  { line:18, visited:['A','B','C'], cur:'C', msg:"Dequeue C — explore C's unvisited neighbors: F" },
  { line:19, visited:['A','B','C'], cur:'C', msg:"C added to result. Enqueue F" },
  { line:18, visited:['A','B','C','D'], cur:'D', msg:"Dequeue D — no unvisited neighbors" },
  { line:18, visited:['A','B','C','D','E'], cur:'E', msg:"Dequeue E — F already queued, skip" },
  { line:18, visited:['A','B','C','D','E','F'], cur:'F', msg:"Dequeue F — all neighbors visited. Queue empty!" },
  { line:25, visited:['A','B','C','D','E','F'], cur:null, msg:"BFS complete! Result: <strong>['A','B','C','D','E','F']</strong>" },
];

let treeState = { nodes: [], prevLine: null };
let gState    = { visited: [], prevLine: null };

function resetTreeSection() {
  treeState = { nodes: [], prevLine: null };
  gState    = { visited: [], prevLine: null };
  if (currentTreeMode === 'bst-tab') {
    renderCode('tree-code', bstCode);
    renderBSTDiagram([]);
  } else {
    renderCode('tree-code', graphCode);
    renderGraphDiagram([]);
  }
  treeCallout.innerHTML = 'Press <strong>Step →</strong> to begin';
}

function runTreeStep(i) {
  if (currentTreeMode === 'bst-tab') {
    const s = bstSteps[i];
    highlightLine('tree-code', s.line, treeState.prevLine);
    treeState.prevLine = s.line;
    renderBSTDiagram(s.nodes, s.hl);
    treeCallout.innerHTML = s.msg;
  } else {
    const s = graphSteps[i];
    highlightLine('tree-code', s.line, gState.prevLine);
    gState.prevLine = s.line;
    renderGraphDiagram(s.visited, s.cur);
    treeCallout.innerHTML = s.msg;
  }
}

document.querySelectorAll('[data-tab="bst-tab"], [data-tab="graph-tab"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab="bst-tab"], [data-tab="graph-tab"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTreeMode = btn.dataset.tab;
    resetTreeSection();
    const steps = currentTreeMode === 'bst-tab' ? bstSteps : graphSteps;
    document.getElementById('tree-step-total').textContent = steps.length;
    document.getElementById('tree-step-num').textContent = 0;
  });
});

renderCode('tree-code', bstCode);
renderBSTDiagram([]);

makeController(
  document.getElementById('tree-step'),
  document.getElementById('tree-reset'),
  document.getElementById('tree-auto'),
  document.getElementById('tree-step-num'),
  document.getElementById('tree-step-total'),
  bstSteps,
  (i) => {
    const steps = currentTreeMode === 'bst-tab' ? bstSteps : graphSteps;
    if (i < steps.length) runTreeStep(i);
  },
  resetTreeSection
);

document.getElementById('tree-step-total').textContent = bstSteps.length;