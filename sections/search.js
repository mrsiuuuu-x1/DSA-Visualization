function renderSearchDiagram(elId, bars) {
    const el = document.getElementById(elId);
    el.innerHTML = '';

    if (!bars || bars.length === 0) {
        el.innerHTML = '<span class="diagram-placeholder">[ empty ]</span>';
        return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'search-bars';

    bars.forEach(({ val, color, pointer }) => {
        const col = document.createElement('div');
        col.className = 'search-col';

        const box = document.createElement('div');
        box.className = `search-box search-box--${color || 'default'}`;
        box.textContent = val;

        const ptr = document.createElement('div');
        ptr.className = 'search-ptr';
        ptr.innerHTML = pointer ? `<span class="search-ptr-label">${pointer}</span>` : '&nbsp;';

        col.appendChild(ptr);
        col.appendChild(box);
        wrap.appendChild(col);
    });

    el.appendChild(wrap);
}

// Step builder helpers
const SEARCH_ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const SEARCH_TARGET = 23;

function buildSearchBars(arr, left, mid, right, foundIdx = -1, eliminatedBelow = -1, eliminatedAbove = Infinity) {
    return arr.map((val, idx) => {
        let color = 'default';
        let pointer = null;

        if (foundIdx === idx) {
            color = 'found';
        } else if (idx < eliminatedBelow || idx > eliminatedAbove) {
            color = 'eliminated';
        } else if (idx === mid && mid >= 0) {
            color = 'mid';
        } else if (idx >= left && idx <= right) {
            color = 'active';
        } else {
            color = 'eliminated';
        }

        const parts = [];
        if (idx === left  && left  >= 0) parts.push('L');
        if (idx === mid   && mid   >= 0) parts.push('M');
        if (idx === right && right >= 0) parts.push('R');
        if (parts.length) pointer = parts.join(' ');

        return { val, color, pointer };
    });
}

// Build steps
const searchCode = [
    "arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]",
    "target = 23",
    "",
    "def binary_search(arr, target):",
    "    left, right = 0, len(arr) - 1",
    "    while left <= right:",
    "        mid = (left + right) // 2",
    "        if arr[mid] == target:",
    "            return mid",
    "        elif arr[mid] < target:",
    "            left = mid + 1",
    "        else:",
    "            right = mid - 1",
    "    return -1",
    "",
    "result = binary_search(arr, target)",
];

function buildSearchSteps() {
    const arr = [...SEARCH_ARR];
    const target = SEARCH_TARGET;
    const n = arr.length;
    const steps = [];

    const init = buildSearchBars(arr, -1, -1, -1);

    steps.push({ line: 0,  bars: init, msg: `<code>arr = [${arr.join(', ')}]</code> — a <strong>sorted</strong> array. Binary search only works on sorted data` });
    steps.push({ line: 1,  bars: init, msg: `<code>target = ${target}</code> — the value we're searching for` });
    steps.push({ line: 3,  bars: init, msg: "<code>def binary_search</code> — each iteration eliminates <strong>half</strong> the remaining elements" });

    let left = 0, right = n - 1;
    steps.push({
        line: 4,
        bars: buildSearchBars(arr, left, -1, right),
        msg: `<code>left = 0, right = ${right}</code> — search window covers the whole array`
    });

    let elimBelow = 0, elimAbove = n - 1;
    let iteration = 0;

    while (left <= right) {
        iteration++;
        const mid = Math.floor((left + right) / 2);

        steps.push({
            line: 5,
            bars: buildSearchBars(arr, left, -1, right, -1, elimBelow - 1, elimAbove + 1 > n - 1 ? Infinity : elimAbove + 1),
            msg: `<code>left (${left}) &lt;= right (${right})</code> → True — window still has elements, keep searching`
        });
        steps.push({
            line: 6,
            bars: buildSearchBars(arr, left, mid, right, -1, elimBelow - 1, elimAbove + 1 > n - 1 ? Infinity : elimAbove + 1),
            msg: `<code>mid = (${left} + ${right}) // 2 = ${mid}</code> — check the middle element: <strong>${arr[mid]}</strong>`
        });
        steps.push({
            line: 7,
            bars: buildSearchBars(arr, left, mid, right, -1, elimBelow - 1, elimAbove + 1 > n - 1 ? Infinity : elimAbove + 1),
            msg: `<code>arr[${mid}] == ${target}</code> → ${arr[mid]} == ${target} is <strong>${arr[mid] === target}</strong>`
        });

        if (arr[mid] === target) {
            steps.push({
                line: 8,
                bars: buildSearchBars(arr, left, mid, right, mid),
                msg: `✅ <strong>Found!</strong> arr[${mid}] = ${target} — returning index <strong>${mid}</strong>`
            });
            break;
        } else if (arr[mid] < target) {
            steps.push({
                line: 9,
                bars: buildSearchBars(arr, left, mid, right, -1, elimBelow - 1, elimAbove + 1 > n - 1 ? Infinity : elimAbove + 1),
                msg: `<code>arr[${mid}] = ${arr[mid]} &lt; ${target}</code> → True — target is in the <strong>right half</strong>, discard left`
            });
            elimBelow = mid + 1;
            left = mid + 1;
            steps.push({
                line: 10,
                bars: buildSearchBars(arr, left, -1, right, -1, elimBelow - 1),
                msg: `<code>left = mid + 1 = ${left}</code> — eliminated indices 0–${mid}, search window: [${left}…${right}]`
            });
        } else {
            steps.push({
                line: 11,
                bars: buildSearchBars(arr, left, mid, right, -1, elimBelow - 1, elimAbove + 1 > n - 1 ? Infinity : elimAbove + 1),
                msg: `<code>arr[${mid}] = ${arr[mid]} &gt; ${target}</code> → True — target is in the <strong>left half</strong>, discard right`
            });
            elimAbove = mid - 1;
            right = mid - 1;
            steps.push({
                line: 12,
                bars: buildSearchBars(arr, left, -1, right, -1, elimBelow - 1, elimAbove),
                msg: `<code>right = mid - 1 = ${right}</code> — eliminated indices ${mid}–${n-1}, search window: [${left}…${right}]`
            });
        }
    }

    if (left > right) {
        steps.push({
            line: 5,
            bars: arr.map(v => ({ val: v, color: 'eliminated', pointer: null })),
            msg: `<code>left (${left}) &lt;= right (${right})</code> → False — search window empty, target not found. Returns <strong>-1</strong>`
        });
        steps.push({
            line: 13,
            bars: arr.map(v => ({ val: v, color: 'eliminated', pointer: null })),
            msg: `❌ <strong>Not found</strong> — ${target} is not in the array`
        });
    }

    steps.push({
        line: 15,
        bars: steps[steps.length - 1].bars,
        msg: `<code>result = binary_search(arr, ${target})</code> — completed in <strong>${iteration} iteration${iteration > 1 ? 's' : ''}</strong> instead of up to ${n} with linear search`
    });

    return steps;
}

// Controller
let searchSteps = buildSearchSteps();
let searchState = { prevLine: null };

makeController(
    document.getElementById('search-step'),
    document.getElementById('search-reset'),
    document.getElementById('search-auto'),
    document.getElementById('search-step-num'),
    document.getElementById('search-step-total'),
    searchSteps,
    (i) => {
        const s = searchSteps[i];
        highlightLine('search-code', s.line, searchState.prevLine);
        searchState.prevLine = s.line;
        renderSearchDiagram('search-diagram', s.bars);
        document.getElementById('search-callout').innerHTML = s.msg;
    },
    () => {
        searchState = { prevLine: null };
        searchSteps = buildSearchSteps();
        renderCode('search-code', searchCode);
        renderSearchDiagram('search-diagram', buildSearchBars(SEARCH_ARR, -1, -1, -1));
        document.getElementById('search-callout').innerHTML = 'Press <strong>Step -></strong> to begin';
        document.getElementById('search-step-total').textContent = searchSteps.length;
    }
);

// Initial render
renderCode('search-code', searchCode);
renderSearchDiagram('search-diagram', buildSearchBars(SEARCH_ARR, -1, -1, -1));
document.getElementById('search-step-total').textContent = searchSteps.length;

// Interactive mode
document.getElementById('search-run').addEventListener('click', function () {
    runVisualize(
        document.getElementById('search-editor').value,
        document.getElementById('search-interactive-diagram'),
        document.getElementById('search-interactive-callout'),
        document.getElementById('search-py-status'),
        renderInteractiveArray, this,
        'search-interactive-code', 'search-editor'
    );
});