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
  "        else:",
  "            HeadPointer += 1",
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
  { line:33, items:[15],           head:0, tail:0, count:1, msg:"<code>EnQueue(15)</code> — NumberItems was 0 → Head=0, Tail=0. Queue[0]=15. Count: 1" },
  { line:34, items:[15,32],        head:0, tail:1, count:2, msg:"<code>EnQueue(32)</code> — Tail: 0→1. Queue[1]=32. Count: 2" },
  { line:35, items:[15,32,8],      head:0, tail:2, count:3, msg:"<code>EnQueue(8)</code> — Tail: 1→2. Queue[2]=8. Count: 3" },
  { line:36, items:[15,32,8,61],   head:0, tail:3, count:4, msg:"<code>EnQueue(61)</code> — Tail: 2→3. Queue[3]=61. Count: 4" },
  { line:37, items:[15,32,8,61,27],head:0, tail:4, count:5, msg:"<code>EnQueue(27)</code> — Tail: 3→4. Queue[4]=27. Count: 5" },
  { line:39, items:[32,8,61,27],   head:1, tail:4, count:4, msg:"<code>DeQueue()</code> — item = Queue[0] = 15. Head: 0→1. Count: 4. Returns 15" },
  { line:40, items:[8,61,27],      head:2, tail:4, count:3, msg:"<code>DeQueue()</code> — item = Queue[1] = 32. Head: 1→2. Count: 3. Returns 32" },
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
  document.getElementById('queue-step'),
  document.getElementById('queue-reset'),
  document.getElementById('queue-auto'),
  document.getElementById('queue-step-num'),
  document.getElementById('queue-step-total'),
  queueSteps,
  (i) => {
    const s = queueSteps[i];
    highlightLine('queue-code', s.line, qState.prevLine);
    qState.prevLine = s.line;
    renderQueueDiagram(s.items, s.head, s.tail, s.count);
    queueCalloutEl.innerHTML = s.msg;
  },
  resetQueue
);

// Interactive
document.getElementById('queue-run').addEventListener('click', function () {
  runVisualize(
    document.getElementById('queue-editor').value,
    document.getElementById('queue-interactive-diagram'),
    document.getElementById('queue-interactive-callout'),
    document.getElementById('queue-py-status'),
    renderInteractiveQueue, this,
    'queue-interactive-code', 'queue-editor'
  );
});