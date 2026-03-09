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
  "    def delete(self, val):",
  "        if not self.head:",
  "            return",
  "        if self.head.val == val:",
  "            self.head = self.head.next",
  "            return",
  "        curr = self.head",
  "        while curr.next:",
  "            if curr.next.val == val:",
  "                curr.next = curr.next.next",
  "                return",
  "            curr = curr.next",
  "",
  "ll = LinkedList()",
  "ll.append(10)",
  "ll.append(20)",
  "ll.append(30)",
  "ll.delete(20)",
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

  // Record table
  const table = document.createElement('div');
  table.className = 'll-record-table';
  table.style.cssText = 'display:flex;flex-direction:column;gap:4px;margin-top:12px;width:100%;overflow-x:auto;';

  const header = document.createElement('div');
  header.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.65rem;color:var(--text-dim);';
  header.innerHTML = '<div style="width:36px;text-align:center">field</div>'
    + nodes.map((_, i) => `<div style="width:68px;text-align:center">Node ${i}</div>`).join('');
  table.appendChild(header);

  const valRow = document.createElement('div');
  valRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.72rem;font-weight:700;';
  valRow.innerHTML = '<div style="width:36px;text-align:right;color:var(--text-dim);padding-right:4px;font-weight:400;font-size:.65rem">val</div>'
    + nodes.map((v, i) => `<div style="width:68px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid ${i===highlightIdx?'var(--accent2)':'var(--border)'};color:${i===highlightIdx?'var(--accent2)':'var(--text)'}">${v}</div>`).join('');
  table.appendChild(valRow);

  const nextRow = document.createElement('div');
  nextRow.style.cssText = 'display:flex;gap:2px;font-family:var(--mono);font-size:.68rem;';
  nextRow.innerHTML = '<div style="width:36px;text-align:right;color:var(--text-dim);padding-right:4px;font-weight:400;font-size:.65rem">next</div>'
    + nodes.map((_, i) => {
      const isLast = i === nodes.length - 1;
      const nxt = isLast ? 'None' : `→${nodes[i+1]}`;
      return `<div style="width:68px;text-align:center;padding:3px 0;background:var(--surface2);border-radius:4px;border:1px solid var(--border);color:${isLast?'var(--text-dim)':'var(--accent2)'}">${nxt}</div>`;
    }).join('');
  table.appendChild(nextRow);

  llDiagramEl.appendChild(table);
}

const llSteps = [
  { line:0,  nodes:[], hl:-1, msg:"<code>class Node</code> — a <strong>record type</strong> with two fields: <code>val</code> (data) and <code>next</code> (pointer to next node)" },
  { line:1,  nodes:[], hl:-1, msg:"<code>__init__</code> — initialize the Node record: set <code>val</code>, set <code>next = None</code>" },
  { line:5,  nodes:[], hl:-1, msg:"<code>class LinkedList</code> — manages a chain of Node records via a <code>head</code> pointer" },
  { line:6,  nodes:[], hl:-1, msg:"<code>self.head = None</code> — empty list: head points to nothing" },
  { line:9,  nodes:[], hl:-1, msg:"<code>append(val)</code> — creates a new Node record and links it at the end of the chain" },
  { line:19, nodes:[], hl:-1, msg:"<code>delete(val)</code> — finds the node with matching val and updates <code>next</code> pointers to bypass it" },
  { line:32, nodes:[], hl:-1, msg:"<code>ll = LinkedList()</code> — create a new empty linked list" },
  { line:33, nodes:[10], hl:0, msg:"<code>ll.append(10)</code> — head is None → Node(10) becomes head. Record: <code>{val:10, next:None}</code>" },
  { line:34, nodes:[10,20], hl:1, msg:"<code>ll.append(20)</code> — traverse to end, set Node(10).next → Node(20). Record: <code>{val:20, next:None}</code>" },
  { line:35, nodes:[10,20,30], hl:2, msg:"<code>ll.append(30)</code> — traverse to end, set Node(20).next → Node(30). Record: <code>{val:30, next:None}</code>" },
  { line:36, nodes:[10,20,30], hl:-1, msg:"<code>ll.delete(20)</code> — search for the node with val=20 to remove it from the chain" },
  { line:22, nodes:[10,20,30], hl:0, msg:"<code>self.head.val == 20?</code> — head.val is 10 ≠ 20. Move to traversal loop" },
  { line:25, nodes:[10,20,30], hl:0, msg:"<code>curr = self.head</code> — start traversing from head: curr → Node(10)" },
  { line:27, nodes:[10,20,30], hl:1, msg:"<code>curr.next.val == 20?</code> — Yes! Node(10).next is Node(20), and 20 == 20. Found it!" },
  { line:28, nodes:[10,30], hl:0, msg:"<code>curr.next = curr.next.next</code> — Node(10).next now → Node(30), bypassing Node(20). <strong>Deletion complete!</strong>" },
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
  document.getElementById('linked-step'),
  document.getElementById('linked-reset'),
  document.getElementById('linked-auto'),
  document.getElementById('linked-step-num'),
  document.getElementById('linked-step-total'),
  llSteps,
  (i) => {
    const s = llSteps[i];
    highlightLine('linked-code', s.line, llState.prevLine);
    llState.prevLine = s.line;
    renderLinkedDiagram(s.nodes, s.hl);
    llCalloutEl.innerHTML = s.msg;
  },
  resetLinked
);

// Interactive
document.getElementById('linkedlist-run').addEventListener('click', function () {
  runVisualize(
    document.getElementById('linkedlist-editor').value,
    document.getElementById('linkedlist-interactive-diagram'),
    document.getElementById('linkedlist-interactive-callout'),
    document.getElementById('linkedlist-py-status'),
    renderInteractiveLinkedList, this,
    'linkedlist-interactive-code', 'linkedlist-editor'
  );
});