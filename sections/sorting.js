function renderSortDiagram(elId,bars) {
    const el = document.getElementById(elId);
    el.innerHTML = '';

    if (!bars || bars.length === 0) {
        el.innerHTML = '<span class="diagram-placeholder"> [ empty ]</span>';
        return;
    }

    const max = Math.max(...bars.map(b => b.val));
    const wrap = document.createElement('div');
    wrap.className = 'sort-bars';

    bars.forEach(({val,color}) => {
        const col = document.createElement('div');
        col.className = 'sort-col';

        const bar = document.createElement('div');
        bar.className = `sort-bar sort-bar--${color || 'default'}`;
        bar.style.height = `${Math.round((val / max) * 140) + 20}px`;

        const label = document.createElement('div');
        label.className = 'sort-label';
        label.textContent = val;

        col.appendChild(bar);
        col.appendChild(label);
        wrap.appendChild(col);
    });
    
    el.appendChild(wrap);
}

// Helpers to build step bar states
function plain(arr) {
    return arr.map(v => (
        {val:v, color: 'default'}
    ));
}
function withCompare(arr,i,j) {
    return arr.map((v,idx) => (
        {val:v, color: (idx === i || idx === j) ? 'comparing' : 'default'}
    ));
}
function withSwap(arr,i,j) {
    return arr.map((v,idx) => ({val:v, color: (idx === i || idx === j) ? 'swapping' : 'default'}));
}

function withSorted(arr, sortedFrom) {
    return arr.map((v,idx) => ({ val:v, color:idx >= sortedFrom ? 'sorted' : 'default'}));
}
function withKey(arr, keyIdx, sortedUpTo) {
  return arr.map((v, idx) => ({
    val: v,
    color: idx === keyIdx ? 'key'
         : idx < sortedUpTo ? 'sorted'
         : 'default'
  }));
}

//  BUBBLE SORT

const bubbleCode = [
    "arr = [64, 34, 25, 12, 22, 11, 90]",
    "",
    "def bubble_sort(arr):",
    "    n = len(arr)",
    "    for i in range(n):",
    "        for j in range(n - i - 1):",
    "            if arr[j] > arr[j + 1]:",
    "                arr[j], arr[j+1] = arr[j+1], arr[j]",
    "",
    "bubble_sort(arr)",
];

function buildBubbleSteps() {
    const arr = [64,34,25,12,22,11,90];
    const steps = [];

    steps.push({line: 0, bars: plain([...arr]), msg: "<code>arr = [64, 34, 25, 12, 22, 11, 90]</code> - initial unsorted array"});
    steps.push({line: 2, bars: plain([...arr]), msg: "<code>def bubble_sort(arr)</code> — repeatedly compare adjacent elements and swap if out of order"});
    steps.push({line: 3, bars: plain([...arr]), msg: `<code>n = len(arr)</code> — n = ${arr.length}. We'll do up to n passes`});

    const a = [...arr];
    const n = a.length;

    for (let i = 0; i < n; i++) {
        let swapped = false;
        steps.push({line: 4, bars: withSorted([...a], n - i), msg: `<code>pass ${i + 1}</code> — elements from index ${n - i} onward are already sorted`});

        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
            line: 5,
            bars: withCompare([...a], j, j + 1),
            msg: `<code>j = ${j}</code> — comparing <strong>${a[j]}</strong> and <strong>${a[j+1]}</strong>`
        });
        steps.push({
            line: 9,
            bars: withCompare([...a], j, j + 1),
            msg: `<code>arr[${j}] > arr[${j+1}]</code> → ${a[j]} > ${a[j+1]} is <strong>${a[j] > a[j+1]}</strong>`
        });
        if (a[j] > a[j+1]) {
            steps.push({
                line: 7,
                bars: withSwap([...a], j, j + 1),
                msg: `<code>swap</code> — ${a[j]} and ${a[j+1]} are swapped`
            });
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            swapped = true;
            steps.push({
                line: 7,
                bars: withSorted([...a], n - 1),
                msg: `After swap: <strong>[${a.join(', ')}]</strong>`
            });
        }
    }
    if (!swapped) {
        steps.push({
            line: 4,
            bars: plain([...a]).map((b, idx) => ({...b, color: 'sorted'})),
            msg: "No swaps in this pass - array is <strong>sorted!</strong>"
        });
        break;
    }
    }
    steps.push({
        line: 9,
        bars: a.map(v => ({val: v, color: 'sorted'})), msg: `✅ <strong>Bubble Sort complete!</strong> Final: [${a.join(', ')}]`
    });
    return steps;
}

// INSERTION SORT

const insertionCode = [
    "arr = [64, 34, 25, 12, 22, 11, 90]",
    "",
    "def insertion_sort(arr):",
    "    for i in range(1, len(arr)):",
    "        key = arr[i]",
    "        j = i - 1",
    "        while j >= 0 and arr[j] > key:",
    "            arr[j + 1] = arr[j]",
    "            j -= 1",
    "        arr[j + 1] = key",
    "",
    "insertion_sort(arr)",
];

function buildInsertionSteps() {
    const arr = [64, 34, 25, 12, 22, 11, 90];
    const steps = [];

    steps.push({line: 0,  bars: plain([...arr]), msg: "<code>arr = [64, 34, 25, 12, 22, 11, 90]</code> — initial unsorted array"});
    steps.push({line: 2,  bars: plain([...arr]), msg: "<code>def insertion_sort(arr)</code> — build a sorted section one element at a time by inserting each into its correct position"});

    const a = [...arr];
    const n = a.length;

    for (let i = 1; i < n; i++) {
        const key = a[i];
        steps.push({
            line: 3,
            bars: withKey([...a], i, i),
            msg: `<code>i = ${i}</code> — sorted section is <strong>[${a.slice(0,i).join(', ')}]</strong>, now inserting <strong>${key}</strong>`
        });
        steps.push({
            line: 4,
            bars: withKey([...a], i, i),
            msg: `<code>key = arr[${i}]</code> — pick up <strong>${key}</strong> to insert into sorted section`
        });

        let j = i - 1;
        steps.push({
            line: 5,
            bars: withKey([...a], i, i),
            msg: `<code>j = ${j}</code> — start comparing from the end of sorted section`
        });

        let moved = false;
        while (j >= 0 && a[j] > key) {
            steps.push({
                line: 6,
                bars: withKey([...a], j, i),
                msg: `<code>arr[${j}] = ${a[j]} > key = ${key}</code> → True — shift <strong>${a[j]}</strong> right`
            });
            a[j + 1] = a[j];
            moved = true;
            steps.push({
                line: 7,
                bars: withKey([...a], j + 1, i),
                msg: `<code>arr[${j + 1}] = arr[${j}]</code> — shifted ${a[j]} to index ${j + 1}`
            });
            j--;
            steps.push({
                line: 8,
                bars: withKey([...a], Math.max(j, 0), i),
                msg: j >= 0
                ? `<code>j = ${j}</code> — continue checking arr[${j}] = ${a[j]}`
                : `<code>j = ${j}</code> — reached start of array`
            });
        }

        if (!moved) {
            steps.push({
                line: 6,
                bars: withKey([...a], j, i),
                msg: `<code>arr[${j}] = ${a[j]} > ${key}</code> → False — <strong>${key}</strong> is already in place`
            });
        }

        a[j + 1] = key;
        steps.push({
            line: 9,
            bars: withKey([...a], j + 1, i + 1),
            msg: `<code>arr[${j + 1}] = ${key}</code> — placed <strong>${key}</strong> at index ${j + 1}. Sorted: <strong>[${a.slice(0, i+1).join(', ')}]</strong>`
        });
    }

    steps.push({
        line: 11,
        bars: a.map(v => ({val: v, color: 'sorted'})),
        msg: `✅ <strong>Insertion Sort complete!</strong> Final: [${a.join(', ')}]`
    });
    return steps;
}

// STEP MODE CONTROLLER

let currentAlgo = 'bubble';
let sortSteps = buildBubbleSteps();
let sortState = {prevLine: null};
let sortController = null;

function resetSorting() {
    sortState = {prevLine: null};
    renderCode('sorting-code', currentAlgo === 'bubble' ? bubbleCode : insertionCode);
    renderSortDiagram('sorting-diagrma', plain([64, 34, 25, 12, 22, 11, 90]));
    document.getElementById('sorting-callout').innerHTML = 'Press <strong>Step -></strong> to begin';
}

function initSortController() {
    sortSteps = currentAlgo === 'bubble' ? buildBubbleSteps() : buildInsertionSteps();
    sortState = { prevLine: null };
    renderCode('sorting-code', currentAlgo === 'bubble' ? bubbleCode : insertionCode);
    renderSortDiagram('sorting-diagram', plain([64, 34, 25, 12, 22, 11, 90]));
    document.getElementById('sorting-callout').innerHTML = 'Press <strong>Step →</strong> to begin';
    document.getElementById('sorting-step-num').textContent = 0;
    document.getElementById('sorting-step-total').textContent = sortSteps.length;
}

// Algorithm toggle buttons
document.getElementById('sort-bubble-btn').addEventListener('click', () => {
    if (currentAlgo === 'bubble') return;
    currentAlgo = 'bubble';
    document.getElementById('sort-bubble-btn').classList.add('active');
    document.getElementById('sort-insertion-btn').classList.remove('active');
    initSortController();
});
document.getElementById('sort-insertion-btn').addEventListener('click', () => {
    if (currentAlgo === 'insertion') return;
    currentAlgo = 'insertion';
    document.getElementById('sort-insertion-btn').classList.add('active');
    document.getElementById('sort-bubble-btn').classList.remove('active');
    initSortController();
});

initSortController();

const sortStepsProxy = {
    get length() {return sortSteps.length;}
};

makeController(
    document.getElementById('sorting-step'),
    document.getElementById('sorting-reset'),
    document.getElementById('sorting-auto'),
    document.getElementById('sorting-step-num'),
    document.getElementById('sorting-step-total'),
    sortStepsProxy,
    (i) => {
        const s = sortSteps[i];
        highlightLine('sorting-code', s.line, sortState.prevLine);
        sortState.prevLine = s.line;
        renderSortDiagram('sorting-diagram', s.bars);
        document.getElementById('sorting-callout').innerHTML = s.msg;
    },
    () => {
        sortState = { prevLine: null };
        sortSteps = currentAlgo === 'bubble' ? buildBubbleSteps() : buildInsertionSteps();
        renderCode('sorting-code', currentAlgo === 'bubble' ? bubbleCode : insertionCode);
        renderSortDiagram('sorting-diagram', plain([64, 34, 25, 12, 22, 11, 90]));
        document.getElementById('sorting-callout').innerHTML = 'Press <strong>Step →</strong> to begin';
        document.getElementById('sorting-step-total').textContent = sortSteps.length;
    }
);

document.getElementById('sorting-step-total').textContent = sortSteps.length;

// Interactive Mode
function renderInteractiveSorting(diagramEl, snap) {
    diagramEl.innerHTML = '';
    const filled = snap.filter(v => v !== null && v !== '');
    if (filled.length === 0) {
        diagramEl.innerHTML = '<span class="diagram-placeholder">[ empty ]</span>';
        return;
    }
    renderSortDiagram(diagramEl.id, filled.map(v => ({ val: v, color: 'default' })));
}

document.getElementById('sorting-run').addEventListener('click', function () {
    runVisualize(
        document.getElementById('sorting-editor').value,
        document.getElementById('sorting-interactive-diagram'),
        document.getElementById('sorting-interactive-callout'),
        document.getElementById('sorting-py-status'),
        renderInteractiveSorting, this,
        'sorting-interactive-code', 'sorting-editor'
    );
});