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

const treeSVG    = document.getElementById('tree-svg');
const treeCallout = document.getElementById('tree-callout');

function computePositions(treeArr, rootIdx, W) {
  const positions = {};
  if (rootIdx < 0 || treeArr.length === 0) return positions;
  const YGAP = 72, startY = 40;
  function place(idx, x, y, spread) {
    if (idx < 0 || idx >= treeArr.length || !treeArr[idx]) return;
    if (positions[idx]) return;
    positions[idx] = { x, y };
    const n = treeArr[idx];
    if (n.left  !== -1) place(n.left,  x - spread, y + YGAP, spread / 2);
    if (n.right !== -1) place(n.right, x + spread, y + YGAP, spread / 2);
  }
  place(rootIdx, W / 2, startY, W / 4);
  return positions;
}

function renderBTDiagram(treeArr, highlightIdx = -1) {
  const diagramArea = document.getElementById('tree-diagram');
  const oldTable = diagramArea.querySelector('.bt-array-table');
  if (oldTable) oldTable.remove();

  treeSVG.innerHTML = '';
  if (treeArr.length === 0) return;

  const W = treeSVG.clientWidth || 480;
  const positions = computePositions(treeArr, 0, W);

  // Edges
  treeArr.forEach((n, i) => {
    [[n.left, 'left'], [n.right, 'right']].forEach(([childIdx]) => {
      if (childIdx === -1) return;
      const p = positions[i], c = positions[childIdx];
      if (!p || !c) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p.x); line.setAttribute('y1', p.y);
      line.setAttribute('x2', c.x); line.setAttribute('y2', c.y);
      line.setAttribute('class', 'tree-edge' + (childIdx === highlightIdx ? ' active' : ''));
      treeSVG.appendChild(line);
    });
  });

  // Nodes
  treeArr.forEach((n, i) => {
    const pos = positions[i];
    if (!pos) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y); circle.setAttribute('r', 22);
    circle.setAttribute('class', 'tree-circle' + (i === highlightIdx ? ' highlight' : ''));
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
    text.setAttribute('class', 'tree-text'); text.textContent = n.data;
    const idxLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    idxLabel.setAttribute('x', pos.x); idxLabel.setAttribute('y', pos.y - 28);
    idxLabel.setAttribute('class', 'tree-text');
    idxLabel.style.fontSize = '10px'; idxLabel.style.fill = 'var(--text-dim)';
    idxLabel.textContent = '[' + i + ']';
    g.appendChild(circle); g.appendChild(text); g.appendChild(idxLabel);
    treeSVG.appendChild(g);
  });

  // L/D/R table
  const table = document.createElement('div');
  table.className = 'bt-array-table';
  table.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-top:8px;width:100%;overflow-x:auto;';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.65rem;color:var(--text-dim);';
  header.innerHTML = '<div style="width:32px;text-align:center">idx</div>'
    + treeArr.map((_, i) => `<div style="width:44px;text-align:center">[${i}]</div>`).join('');
  table.appendChild(header);

  const leftRow = document.createElement('div');
  leftRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.7rem;';
  leftRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">L</div>'
    + treeArr.map((n, i) => `<div style="width:44px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:${i===highlightIdx?'var(--accent2)':'var(--text-dim)'}">${n.left}</div>`).join('');
  table.appendChild(leftRow);

  const dataRow = document.createElement('div');
  dataRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.75rem;font-weight:700;';
  dataRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">D</div>'
    + treeArr.map((n, i) => `<div style="width:44px;text-align:center;padding:4px 0;background:var(--surface2);border-radius:4px;border:1px solid ${i===highlightIdx?'var(--accent)':'var(--border)'};color:${i===highlightIdx?'var(--accent)':'var(--text)'}">${n.data}</div>`).join('');
  table.appendChild(dataRow);

  const rightRow = document.createElement('div');
  rightRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.7rem;';
  rightRow.innerHTML = '<div style="width:32px;text-align:right;color:var(--text-dim);padding-right:4px">R</div>'
    + treeArr.map((n, i) => `<div style="width:44px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:${i===highlightIdx?'var(--accent2)':'var(--text-dim)'}">${n.right}</div>`).join('');
  table.appendChild(rightRow);

  diagramArea.appendChild(table);
}

const btSteps = [
  { line:0,  tree:[], hl:-1, msg:"<code>class Node</code> — each Node stores <strong>__Data</strong>, <strong>__LeftPointer</strong>, <strong>__RightPointer</strong> (all private, default -1)" },
  { line:5,  tree:[], hl:-1, msg:"<code>GetLeft / GetData / GetRight</code> — public getters allow read-only access to private fields" },
  { line:11, tree:[], hl:-1, msg:"<code>SetLeft / SetData / SetRight</code> — public setters allow controlled modification of private fields" },
  { line:18, tree:[], hl:-1, msg:"<code>class TreeClass</code> — stores nodes in a fixed array <code>__Tree[20]</code>. Uses <strong>integer indices</strong> as pointers instead of object references" },
  { line:19, tree:[], hl:-1, msg:"<code>__FirstNode = -1</code>, <code>__NumberNodes = 0</code> — tree is empty. __Tree is pre-filled with dummy Node(-1) objects" },
  { line:58, tree:[], hl:-1, msg:"<code>TheTree = TreeClass()</code> — create the tree" },
  { line:59, tree:[], hl:-1, msg:"<code>InsertNode(Node(10))</code> — __NumberNodes is 0, so 10 becomes the root at index 0" },
  { line:25, tree:[], hl:-1, msg:"<code>if self.__NumberNodes == 0</code> — True! First node ever inserted" },
  { line:26, tree:[{data:10,left:-1,right:-1}], hl:0, msg:"<code>__Tree[0] = NewNode</code> — place Node(10) at index 0" },
  { line:27, tree:[{data:10,left:-1,right:-1}], hl:0, msg:"<code>__FirstNode = 0</code> — root is at index 0. <code>__NumberNodes</code> becomes 1" },
  { line:60, tree:[{data:10,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(11))</code> — tree is not empty, traverse to find position" },
  { line:30, tree:[{data:10,left:-1,right:-1},{data:11,left:-1,right:-1}], hl:1, msg:"<code>__Tree[1] = Node(11)</code> — place at next free index (1). Now traverse from root" },
  { line:33, tree:[{data:10,left:-1,right:-1},{data:11,left:-1,right:-1}], hl:0, msg:"<code>current = 0</code> (root). Check: Tree[0].GetData()=10 &lt; 11? Yes → go right" },
  { line:34, tree:[{data:10,left:-1,right:-1},{data:11,left:-1,right:-1}], hl:0, msg:"<code>GetRight() == -1</code> → right is empty! Call <code>SetRight(1)</code>" },
  { line:35, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1}], hl:1, msg:"<code>Tree[0].SetRight(1)</code> — node 10's right pointer now = 1. <code>__NumberNodes</code> = 2. Break!" },
  { line:61, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(5))</code> — traverse from root to find correct position" },
  { line:30, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:2, msg:"<code>__Tree[2] = Node(5)</code> — placed at index 2. Traversing from root..." },
  { line:40, tree:[{data:10,left:-1,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:0, msg:"<code>Tree[0].GetData()=10 > 5</code> → go left. <code>GetLeft()==-1</code> → empty! <code>SetLeft(2)</code>" },
  { line:42, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:2, msg:"<code>Tree[0].SetLeft(2)</code> — node 10's left pointer = 2. <code>__NumberNodes</code> = 3. Break!" },
  { line:62, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(1))</code> — 1 &lt; 10 → go left to [2]. 1 &lt; 5 → go left. Empty → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:-1,right:-1},{data:1,left:-1,right:-1}], hl:3, msg:"<code>__Tree[3] = Node(1)</code>. Traverse: root(10)→left→[2](5)→left==-1 → SetLeft(3)" },
  { line:42, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:3,right:-1},{data:1,left:-1,right:-1}], hl:3, msg:"<code>Tree[2].SetLeft(3)</code> — node 5's left pointer = 3. <code>__NumberNodes</code> = 4" },
  { line:63, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:3,right:-1},{data:1,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(20))</code> — 20 > 10 → right→[1](11). 20 > 11 → right==-1 → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:-1},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1}], hl:4, msg:"<code>__Tree[4] = Node(20)</code>. Traverse: [0](10)→right→[1](11)→right==-1 → SetRight(4)" },
  { line:35, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1}], hl:4, msg:"<code>Tree[1].SetRight(4)</code> — node 11's right pointer = 4. <code>__NumberNodes</code> = 5" },
  { line:64, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(7))</code> — 7 &lt; 10 → left→[2](5). 7 > 5 → right==-1 → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:-1},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1}], hl:5, msg:"<code>__Tree[5] = Node(7)</code>. Traverse: [0]→left→[2](5)→right==-1 → SetRight(5)" },
  { line:35, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1}], hl:5, msg:"<code>Tree[2].SetRight(5)</code> — node 5's right pointer = 5. <code>__NumberNodes</code> = 6" },
  { line:65, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1}], hl:-1, msg:"<code>InsertNode(Node(15))</code> — 15 > 10 → right→[1](11). 15 > 11 → right→[4](20). 15 &lt; 20 → left==-1 → insert" },
  { line:30, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:-1,right:-1},{data:7,left:-1,right:-1},{data:15,left:-1,right:-1}], hl:6, msg:"<code>__Tree[6] = Node(15)</code>. Traverse: [0]→[1]→[4](20)→left==-1 → SetLeft(6)" },
  { line:42, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:6,right:-1},{data:7,left:-1,right:-1},{data:15,left:-1,right:-1}], hl:6, msg:"<code>Tree[4].SetLeft(6)</code> — node 20's left = 6. <code>__NumberNodes</code> = 7. All 7 nodes inserted!" },
  { line:66, tree:[{data:10,left:2,right:1},{data:11,left:-1,right:4},{data:5,left:3,right:5},{data:1,left:-1,right:-1},{data:20,left:6,right:-1},{data:7,left:-1,right:-1},{data:15,left:-1,right:-1}], hl:-1,
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

renderCode('tree-code', btCode);
treeSVG.innerHTML = '';

makeController(
  document.getElementById('tree-step'),
  document.getElementById('tree-reset'),
  document.getElementById('tree-auto'),
  document.getElementById('tree-step-num'),
  document.getElementById('tree-step-total'),
  btSteps,
  (i) => {
    const s = btSteps[i];
    highlightLine('tree-code', s.line, treeState.prevLine);
    treeState.prevLine = s.line;
    renderBTDiagram(s.tree, s.hl);
    treeCallout.innerHTML = s.msg;
  },
  resetTreeSection
);

// Interactive
document.getElementById('tree-run').addEventListener('click', function () {
  runVisualize(
    document.getElementById('tree-editor').value,
    document.getElementById('tree-interactive-diagram'),
    document.getElementById('tree-interactive-callout'),
    document.getElementById('tree-py-status'),
    renderInteractiveTree, this,
    'tree-interactive-code', 'tree-editor'
  );
});