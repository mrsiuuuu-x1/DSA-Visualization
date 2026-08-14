// ── Playground Section ────────────────────────────────────────
// Supports Python (Skulpt), JavaScript (sandboxed eval), and
// C++/Java/C via Judge0 CE API (free, no API key required).
// ──────────────────────────────────────────────────────────────

(() => { // IIFE to avoid global scope pollution

const JUDGE0_URL = 'https://ce.judge0.com';

// ── Language ID mapping for Judge0 ───────────────────────────
const JUDGE0_LANG_IDS = {
  cpp: 54,   // C++ (GCC 9.2.0)
  java: 62,  // Java (OpenJDK 13.0.1)
  c: 50,     // C (GCC 9.2.0)
};

// ── Templates per language ───────────────────────────────────
const TEMPLATES = {
  python: {
    empty: `# Write your Python code here\n\narr = []\n\n# @visualize arr`,
    array: `arr = []\n\narr.append(42)\narr.append(17)\narr.append(93)\narr.append(5)\narr.append(68)\narr.pop()\narr.insert(1, 55)\n\n# @visualize arr`,
    linkedlist: `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def append(self, val):\n        new = Node(val)\n        if not self.head:\n            self.head = new\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new\n\n    def to_list(self):\n        result = []\n        curr = self.head\n        while curr:\n            result.append(curr.val)\n            curr = curr.next\n        return result\n\nll = LinkedList()\nll.append(10)\nll.append(20)\nll.append(30)\nsnapshot = ll.to_list()\n\n# @visualize snapshot`,
    stack: `Stack = [-1] * 30\nTopOfStack = -1\n\ndef Push(item):\n    global Stack, TopOfStack\n    if TopOfStack >= 29:\n        print("Stack is full")\n        return False\n    TopOfStack += 1\n    Stack[TopOfStack] = item\n    return True\n\ndef Pop():\n    global Stack, TopOfStack\n    if TopOfStack == -1:\n        print("Stack is empty")\n        return -999\n    item = Stack[TopOfStack]\n    TopOfStack -= 1\n    return item\n\nPush(10)\nPush(25)\nPush(7)\nPop()\nPush(43)\n\n# @visualize Stack`,
    queue: `Queue = [""] * 100\nHeadPointer = -1\nTailPointer = -1\nNumberItems = 0\n\ndef EnQueue(val):\n    global Queue, HeadPointer, TailPointer, NumberItems\n    if NumberItems == 100:\n        return False\n    if NumberItems == 0:\n        HeadPointer = 0\n        TailPointer = 0\n    else:\n        TailPointer = (TailPointer + 1) % 100\n    Queue[TailPointer] = val\n    NumberItems += 1\n    return True\n\ndef DeQueue():\n    global Queue, HeadPointer, TailPointer, NumberItems\n    if NumberItems == 0:\n        return None\n    item = Queue[HeadPointer]\n    NumberItems -= 1\n    if NumberItems == 0:\n        HeadPointer = -1\n        TailPointer = -1\n    else:\n        HeadPointer = (HeadPointer + 1) % 100\n    return item\n\nEnQueue(15)\nEnQueue(32)\nEnQueue(8)\nDeQueue()\nEnQueue(61)\n\n# @visualize Queue`,
    tree: `Tree = [[-1, -1, -1] for x in range(20)]\nRootPointer = -1\nNextFree = 0\n\ndef Insert(val):\n    global Tree, RootPointer, NextFree\n    Tree[NextFree] = [-1, val, -1]\n    if RootPointer == -1:\n        RootPointer = 0\n        NextFree += 1\n        return\n    current = RootPointer\n    while True:\n        if val < Tree[current][1]:\n            if Tree[current][0] == -1:\n                Tree[current][0] = NextFree\n                NextFree += 1\n                break\n            else:\n                current = Tree[current][0]\n        else:\n            if Tree[current][2] == -1:\n                Tree[current][2] = NextFree\n                NextFree += 1\n                break\n            else:\n                current = Tree[current][2]\n\nInsert(10)\nInsert(5)\nInsert(15)\nInsert(3)\nInsert(7)\n\n# @visualize Tree`,
    sorting: `arr = [64, 34, 25, 12, 22, 11, 90]\n\ndef bubble_sort(a):\n    n = len(a)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if a[j] > a[j + 1]:\n                a[j], a[j+1] = a[j+1], a[j]\n\nbubble_sort(arr)\n\n# @visualize arr`,
    search: `arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\ntarget = 23\n\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nresult = binary_search(arr, target)\n\n# @visualize arr`,
  },
  javascript: {
    empty: `// Write your JavaScript code here\n\nlet arr = [];\n\n// @visualize arr`,
    array: `let arr = [];\n\narr.push(42);\narr.push(17);\narr.push(93);\narr.push(5);\narr.push(68);\narr.pop();\narr.splice(1, 0, 55);\n\n// @visualize arr`,
    linkedlist: `let snapshot = [];\n\nclass Node {\n  constructor(val) {\n    this.val = val;\n    this.next = null;\n  }\n}\n\nlet head = null;\n\nfunction append(val) {\n  const node = new Node(val);\n  if (!head) { head = node; return; }\n  let curr = head;\n  while (curr.next) curr = curr.next;\n  curr.next = node;\n}\n\nfunction toList() {\n  let result = [], curr = head;\n  while (curr) { result.push(curr.val); curr = curr.next; }\n  return result;\n}\n\nappend(10);\nappend(20);\nappend(30);\nsnapshot = toList();\n\n// @visualize snapshot`,
    stack: `let stack = [];\n\nstack.push(10);\nstack.push(25);\nstack.push(7);\nstack.pop();\nstack.push(43);\n\n// @visualize stack`,
    queue: `let queue = [];\n\nqueue.push(15);\nqueue.push(32);\nqueue.push(8);\nqueue.shift(); // dequeue\nqueue.push(61);\n\n// @visualize queue`,
    tree: `let Tree = [];\nfor (let i = 0; i < 20; i++) Tree.push([-1, -1, -1]);\nlet rootPtr = -1, nextFree = 0;\n\nfunction insert(val) {\n  Tree[nextFree] = [-1, val, -1];\n  if (rootPtr === -1) { rootPtr = 0; nextFree++; return; }\n  let cur = rootPtr;\n  while (true) {\n    if (val < Tree[cur][1]) {\n      if (Tree[cur][0] === -1) { Tree[cur][0] = nextFree; nextFree++; break; }\n      cur = Tree[cur][0];\n    } else {\n      if (Tree[cur][2] === -1) { Tree[cur][2] = nextFree; nextFree++; break; }\n      cur = Tree[cur][2];\n    }\n  }\n}\n\ninsert(10); insert(5); insert(15); insert(3); insert(7);\n\n// @visualize Tree`,
    sorting: `let arr = [64, 34, 25, 12, 22, 11, 90];\n\nfunction bubbleSort(a) {\n  let n = a.length;\n  for (let i = 0; i < n; i++)\n    for (let j = 0; j < n - i - 1; j++)\n      if (a[j] > a[j+1])\n        [a[j], a[j+1]] = [a[j+1], a[j]];\n}\n\nbubbleSort(arr);\n\n// @visualize arr`,
    search: `let arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];\nlet target = 23;\n\nfunction binarySearch(a, t) {\n  let left = 0, right = a.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (a[mid] === t) return mid;\n    else if (a[mid] < t) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n\nlet result = binarySearch(arr, target);\n\n// @visualize arr`,
  },
  cpp: {
    empty: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> arr;\n\n    // Your code here\n\n    // @visualize arr\n    return 0;\n}`,
    array: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> arr;\n    arr.push_back(42);\n    arr.push_back(17);\n    arr.push_back(93);\n    arr.push_back(5);\n    arr.push_back(68);\n    arr.pop_back();\n\n    // @visualize arr\n    return 0;\n}`,
    linkedlist: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> snapshot;\n    snapshot.push_back(10);\n    snapshot.push_back(20);\n    snapshot.push_back(30);\n\n    // @visualize snapshot\n    return 0;\n}`,
    stack: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> stack;\n    stack.push_back(10);\n    stack.push_back(25);\n    stack.push_back(7);\n    stack.pop_back();\n    stack.push_back(43);\n\n    // @visualize stack\n    return 0;\n}`,
    queue: `#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nint main() {\n    deque<int> q;\n    q.push_back(15);\n    q.push_back(32);\n    q.push_back(8);\n    q.pop_front();\n    q.push_back(61);\n\n    vector<int> queue(q.begin(), q.end());\n    // @visualize queue\n    return 0;\n}`,
    tree: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint Tree[20][3];\nint nextFree = 0, rootPtr = -1;\n\nvoid initTree() {\n    for (int i = 0; i < 20; i++)\n        Tree[i][0] = Tree[i][1] = Tree[i][2] = -1;\n}\n\nvoid insert(int val) {\n    Tree[nextFree][0] = -1;\n    Tree[nextFree][1] = val;\n    Tree[nextFree][2] = -1;\n    if (rootPtr == -1) { rootPtr = 0; nextFree++; return; }\n    int cur = rootPtr;\n    while (true) {\n        if (val < Tree[cur][1]) {\n            if (Tree[cur][0] == -1) { Tree[cur][0] = nextFree; nextFree++; break; }\n            cur = Tree[cur][0];\n        } else {\n            if (Tree[cur][2] == -1) { Tree[cur][2] = nextFree; nextFree++; break; }\n            cur = Tree[cur][2];\n        }\n    }\n}\n\nint main() {\n    initTree();\n    insert(10); insert(5); insert(15); insert(3); insert(7);\n\n    vector<vector<int>> tree;\n    for (int i = 0; i < nextFree; i++)\n        tree.push_back({Tree[i][0], Tree[i][1], Tree[i][2]});\n\n    // @visualize tree\n    return 0;\n}`,
    sorting: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};\n    int n = arr.size();\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j+1])\n                swap(arr[j], arr[j+1]);\n\n    // @visualize arr\n    return 0;\n}`,
    search: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int target = 23;\n    int left = 0, right = arr.size() - 1, result = -1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) { result = mid; break; }\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n\n    // @visualize arr\n    return 0;\n}`,
  },
  java: {
    empty: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> arr = new ArrayList<>();\n\n        // Your code here\n\n        // @visualize arr\n    }\n}`,
    array: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> arr = new ArrayList<>();\n        arr.add(42);\n        arr.add(17);\n        arr.add(93);\n        arr.add(5);\n        arr.add(68);\n        arr.remove(arr.size() - 1);\n\n        // @visualize arr\n    }\n}`,
    linkedlist: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList<Integer> ll = new LinkedList<>();\n        ll.add(10);\n        ll.add(20);\n        ll.add(30);\n\n        List<Integer> snapshot = new ArrayList<>(ll);\n        // @visualize snapshot\n    }\n}`,
    stack: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Stack<Integer> s = new Stack<>();\n        s.push(10);\n        s.push(25);\n        s.push(7);\n        s.pop();\n        s.push(43);\n\n        List<Integer> stack = new ArrayList<>(s);\n        // @visualize stack\n    }\n}`,
    queue: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Queue<Integer> q = new LinkedList<>();\n        q.add(15);\n        q.add(32);\n        q.add(8);\n        q.poll();\n        q.add(61);\n\n        List<Integer> queue = new ArrayList<>(q);\n        // @visualize queue\n    }\n}`,
    tree: `import java.util.*;\n\npublic class Main {\n    static int[][] Tree = new int[20][3];\n    static int nextFree = 0, rootPtr = -1;\n\n    static void insert(int val) {\n        Tree[nextFree] = new int[]{-1, val, -1};\n        if (rootPtr == -1) { rootPtr = 0; nextFree++; return; }\n        int cur = rootPtr;\n        while (true) {\n            if (val < Tree[cur][1]) {\n                if (Tree[cur][0] == -1) { Tree[cur][0] = nextFree; nextFree++; break; }\n                cur = Tree[cur][0];\n            } else {\n                if (Tree[cur][2] == -1) { Tree[cur][2] = nextFree; nextFree++; break; }\n                cur = Tree[cur][2];\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        for (int[] row : Tree) Arrays.fill(row, -1);\n        insert(10); insert(5); insert(15); insert(3); insert(7);\n\n        List<List<Integer>> tree = new ArrayList<>();\n        for (int i = 0; i < nextFree; i++)\n            tree.add(Arrays.asList(Tree[i][0], Tree[i][1], Tree[i][2]));\n\n        // @visualize tree\n    }\n}`,
    sorting: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> arr = new ArrayList<>(Arrays.asList(64, 34, 25, 12, 22, 11, 90));\n        int n = arr.size();\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < n - i - 1; j++)\n                if (arr.get(j) > arr.get(j+1))\n                    Collections.swap(arr, j, j+1);\n\n        // @visualize arr\n    }\n}`,
    search: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> arr = new ArrayList<>(Arrays.asList(2, 5, 8, 12, 16, 23, 38, 56, 72, 91));\n        int target = 23, left = 0, right = arr.size() - 1, result = -1;\n        while (left <= right) {\n            int mid = (left + right) / 2;\n            if (arr.get(mid) == target) { result = mid; break; }\n            else if (arr.get(mid) < target) left = mid + 1;\n            else right = mid - 1;\n        }\n\n        // @visualize arr\n    }\n}`,
  },
  c: {
    empty: `#include <stdio.h>\n\nint main() {\n    int arr[100];\n    int len = 0;\n\n    // Your code here\n\n    // @visualize arr\n    return 0;\n}`,
    array: `#include <stdio.h>\n\nint main() {\n    int arr[100];\n    int len = 0;\n    arr[len++] = 42;\n    arr[len++] = 17;\n    arr[len++] = 93;\n    arr[len++] = 5;\n    arr[len++] = 68;\n    len--; // pop\n\n    // @visualize arr\n    return 0;\n}`,
    linkedlist: `#include <stdio.h>\n\nint main() {\n    int snapshot[] = {10, 20, 30};\n    int len = 3;\n\n    // @visualize snapshot\n    return 0;\n}`,
    stack: `#include <stdio.h>\n\nint main() {\n    int stack[100];\n    int top = -1;\n    stack[++top] = 10;\n    stack[++top] = 25;\n    stack[++top] = 7;\n    top--; // pop\n    stack[++top] = 43;\n\n    int len = top + 1;\n    // @visualize stack\n    return 0;\n}`,
    queue: `#include <stdio.h>\n\nint main() {\n    int queue[100];\n    int front = 0, rear = -1, count = 0;\n    queue[++rear] = 15; count++;\n    queue[++rear] = 32; count++;\n    queue[++rear] = 8;  count++;\n    front++; count--; // dequeue\n    queue[++rear] = 61; count++;\n\n    int len = count;\n    // @visualize queue\n    return 0;\n}`,
    tree: `#include <stdio.h>\n\nint Tree[20][3];\nint nextFree = 0, rootPtr = -1;\n\nvoid initTree() {\n    for (int i = 0; i < 20; i++)\n        Tree[i][0] = Tree[i][1] = Tree[i][2] = -1;\n}\n\nvoid insert(int val) {\n    Tree[nextFree][0] = -1;\n    Tree[nextFree][1] = val;\n    Tree[nextFree][2] = -1;\n    if (rootPtr == -1) { rootPtr = 0; nextFree++; return; }\n    int cur = rootPtr;\n    while (1) {\n        if (val < Tree[cur][1]) {\n            if (Tree[cur][0] == -1) { Tree[cur][0] = nextFree; nextFree++; break; }\n            cur = Tree[cur][0];\n        } else {\n            if (Tree[cur][2] == -1) { Tree[cur][2] = nextFree; nextFree++; break; }\n            cur = Tree[cur][2];\n        }\n    }\n}\n\nint main() {\n    initTree();\n    insert(10); insert(5); insert(15); insert(3); insert(7);\n\n    int len = nextFree;\n    // @visualize Tree\n    return 0;\n}`,
    sorting: `#include <stdio.h>\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    int n = 7;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j+1]) {\n                int tmp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = tmp;\n            }\n\n    int len = n;\n    // @visualize arr\n    return 0;\n}`,
    search: `#include <stdio.h>\n\nint main() {\n    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int n = 10, target = 23;\n    int left = 0, right = n - 1, result = -1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) { result = mid; break; }\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n\n    int len = n;\n    // @visualize arr\n    return 0;\n}`,
  },
};
// C templates alias
TEMPLATES.c = TEMPLATES.c || TEMPLATES.cpp;

// ── DOM references ───────────────────────────────────────────
const langSelect     = document.getElementById('pg-lang');
const templateSelect = document.getElementById('pg-template');
const editor         = document.getElementById('pg-editor');
const runBtn         = document.getElementById('pg-run');
const statusEl       = document.getElementById('pg-status');
const diagramEl      = document.getElementById('pg-diagram');
const calloutEl      = document.getElementById('pg-callout');
const consoleEl      = document.getElementById('pg-console');
const codeViewEl     = document.getElementById('pg-code-view');

// ── Template switching ───────────────────────────────────────
function loadTemplate() {
  const lang = langSelect.value;
  const tpl  = templateSelect.value;
  const templates = TEMPLATES[lang] || TEMPLATES.python;
  editor.value = templates[tpl] || templates.empty || '';
}

langSelect.addEventListener('change', loadTemplate);
templateSelect.addEventListener('change', loadTemplate);

// ── Comment tag detection per language ───────────────────────
function getVizTag(code, lang) {
  // Python uses #, others use //
  const regex = lang === 'python'
    ? /#\s*@visualize\s+(\w+)/
    : /\/\/\s*@visualize\s+(\w+)/;
  const match = code.match(regex);
  return match ? match[1] : null;
}

// ── JavaScript execution (sandboxed) ─────────────────────────
function runJavaScript(userCode, varName) {
  let consoleOutput = '';
  const fakeConsole = {
    log: (...args) => { consoleOutput += args.map(String).join(' ') + '\n'; },
    error: (...args) => { consoleOutput += 'ERROR: ' + args.map(String).join(' ') + '\n'; },
    warn: (...args) => { consoleOutput += 'WARN: ' + args.map(String).join(' ') + '\n'; },
  };

  // Build wrapper that captures the variable
  const wrapper = `
    (function(console) {
      ${userCode}
      return typeof ${varName} !== 'undefined' ? JSON.parse(JSON.stringify(${varName})) : undefined;
    })
  `;

  try {
    const fn = eval(wrapper);
    const result = fn(fakeConsole);
    return { result, consoleOutput, error: null };
  } catch (e) {
    return { result: null, consoleOutput, error: e.toString() };
  }
}

// ── Judge0 API execution (C++/Java/C) ────────────────────────
function wrapCodeForJudge0(code, varName, lang) {
  // Inject serialization code to print the variable as JSON
  if (lang === 'cpp' || lang === 'c') {
    // Find the // @visualize line and inject print code before return 0
    const lines = code.split('\n');
    const out = [];
    let injected = false;
    for (const line of lines) {
      if (/\/\/\s*@visualize/.test(line) && !injected) {
        injected = true;
        // Print as JSON array
        out.push(`    // --- auto-generated serialization ---`);
        out.push(`    printf("[");`);
        if (lang === 'cpp') {
          out.push(`    for (int _i = 0; _i < (int)${varName}.size(); _i++) {`);
          out.push(`        if (_i > 0) printf(", ");`);
          // Check if it's a vector of vectors (tree)
          out.push(`        if constexpr (requires { ${varName}[0][0]; }) {`);
          out.push(`            printf("[%d, %d, %d]", ${varName}[_i][0], ${varName}[_i][1], ${varName}[_i][2]);`);
          out.push(`        } else {`);
          out.push(`            printf("%d", ${varName}[_i]);`);
          out.push(`        }`);
          out.push(`    }`);
        } else {
          // C fallback - use len variable
          out.push(`    for (int _i = 0; _i < len; _i++) {`);
          out.push(`        if (_i > 0) printf(", ");`);
          out.push(`        printf("%d", ${varName}[_i]);`);
          out.push(`    }`);
        }
        out.push(`    printf("]\\n");`);
        out.push(`    // --- end serialization ---`);
      }
      out.push(line);
    }
    return out.join('\n');
  }

  if (lang === 'java') {
    const lines = code.split('\n');
    const out = [];
    let injected = false;
    for (const line of lines) {
      if (/\/\/\s*@visualize/.test(line) && !injected) {
        injected = true;
        out.push(`        // --- auto-generated serialization ---`);
        out.push(`        StringBuilder _sb = new StringBuilder("[");`);
        out.push(`        for (int _i = 0; _i < ${varName}.size(); _i++) {`);
        out.push(`            if (_i > 0) _sb.append(", ");`);
        out.push(`            Object _item = ${varName}.get(_i);`);
        out.push(`            if (_item instanceof java.util.List) {`);
        out.push(`                java.util.List<?> _sub = (java.util.List<?>)_item;`);
        out.push(`                _sb.append("[").append(_sub.stream().map(String::valueOf).collect(java.util.stream.Collectors.joining(", "))).append("]");`);
        out.push(`            } else {`);
        out.push(`                _sb.append(_item);`);
        out.push(`            }`);
        out.push(`        }`);
        out.push(`        _sb.append("]");`);
        out.push(`        System.out.println(_sb);`);
        out.push(`        // --- end serialization ---`);
      }
      out.push(line);
    }
    return out.join('\n');
  }

  return code;
}

async function runJudge0(code, varName, lang) {
  const langId = JUDGE0_LANG_IDS[lang];
  if (!langId) throw new Error(`Unsupported language: ${lang}`);

  const wrappedCode = wrapCodeForJudge0(code, varName, lang);

  // Submit
  const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: wrappedCode,
      language_id: langId,
      stdin: '',
    }),
  });

  if (!submitRes.ok) {
    const errText = await submitRes.text();
    if (submitRes.status === 429) {
      throw new Error('Rate limited — please wait a moment and try again.');
    }
    throw new Error(`Judge0 submission failed: ${submitRes.status} ${errText}`);
  }

  const { token } = await submitRes.json();

  // Poll for result (max 30 seconds)
  for (let attempt = 0; attempt < 15; attempt++) {
    await new Promise(r => setTimeout(r, 2000));

    const resultRes = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`);
    if (!resultRes.ok) continue;

    const result = await resultRes.json();
    // Status 1 = In Queue, 2 = Processing
    if (result.status && result.status.id <= 2) continue;

    // Status 3 = Accepted
    if (result.status && result.status.id === 3) {
      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        error: null,
      };
    }

    // Error states
    const errMsg = result.stderr || result.compile_output || result.status?.description || 'Unknown error';
    return { stdout: '', stderr: '', error: errMsg };
  }

  throw new Error('Execution timed out — the code took too long to run.');
}

// ── Parse Judge0 output into visualization data ──────────────
function parseOutputToSnap(stdout) {
  const lines = stdout.trim().split('\n');
  // Find the last line that looks like a JSON array
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.startsWith('[')) {
      try {
        return JSON.parse(line);
      } catch (e) { /* not valid JSON, try next */ }
    }
  }
  return null;
}

// ── Main playground run handler ──────────────────────────────
async function runPlayground() {
  const lang    = langSelect.value;
  const code    = editor.value;
  const varName = getVizTag(code, lang);

  // Cancel any ongoing animation
  cancelAnimation('pg-diagram');

  consoleEl.textContent = '';
  diagramEl.innerHTML = '<span class="diagram-placeholder">Running...</span>';

  if (!varName) {
    const tag = lang === 'python' ? '# @visualize varName' : '// @visualize varName';
    calloutEl.innerHTML = `<span style="color:#ff5a5a">Add <code>${escapeHTML(tag)}</code> anywhere in your code to tag the variable you want to visualize.</span>`;
    diagramEl.innerHTML = '<span class="diagram-placeholder">Press Run to visualize</span>';
    return;
  }

  runBtn.disabled = true;
  statusEl.textContent = 'Running...';
  statusEl.className = 'pyodide-status';

  try {
    let snap = null;
    let consoleOutput = '';

    if (lang === 'python') {
      // Use existing Skulpt-based runVisualize pipeline
      await runVisualize(
        code,
        diagramEl,
        calloutEl,
        statusEl,
        (el, data, name) => {
          const renderer = autoDetectRenderer(data);
          renderer(el, data, name);
        },
        runBtn,
        'pg-code-view',
        'pg-editor'
      );
      return; // runVisualize handles everything including re-enabling the button

    } else if (lang === 'javascript') {
      const jsResult = runJavaScript(code, varName);
      consoleOutput = jsResult.consoleOutput;
      if (jsResult.error) throw new Error(jsResult.error);
      snap = jsResult.result;

    } else {
      // C++/Java/C via Judge0
      statusEl.textContent = 'Compiling & running remotely...';
      const j0Result = await runJudge0(code, varName, lang);
      if (j0Result.error) throw new Error(j0Result.error);
      consoleOutput = j0Result.stderr || '';
      snap = parseOutputToSnap(j0Result.stdout);
      if (!snap) {
        // Show raw output
        consoleOutput = j0Result.stdout;
        throw new Error(`Could not parse output. Make sure your code prints the ${varName} variable as a JSON array.`);
      }
    }

    // Display console output
    if (consoleOutput) {
      consoleEl.textContent = consoleOutput;
    }

    if (!snap || !Array.isArray(snap)) {
      calloutEl.innerHTML = `<span style="color:#ff5a5a">Variable <code>${escapeHTML(varName)}</code> is not an array/list. Only arrays can be visualized.</span>`;
      diagramEl.innerHTML = '<span class="diagram-placeholder">No data to display</span>';
    } else {
      // Auto-detect and render
      const renderer = autoDetectRenderer(snap);
      renderer(diagramEl, snap, varName);

      const filled = Array.isArray(snap[0])
        ? snap.filter(v => Array.isArray(v) && !(v[0] === -1 && v[1] === -1 && v[2] === -1))
        : snap.filter(v => v !== -1 && v !== '' && v !== null);
      calloutEl.innerHTML = `✅ Done — <strong>${escapeHTML(varName)}</strong> has ${filled.length} item(s)`;
    }

    statusEl.textContent = '✓ Ready';
    statusEl.classList.add('ready');

  } catch (e) {
    statusEl.textContent = '✗ Error';
    statusEl.classList.add('error');
    consoleEl.textContent = consoleEl.textContent || e.toString();
    calloutEl.innerHTML = `<span style="color:#ff5a5a">${escapeHTML(e.message || e.toString())}</span>`;
    diagramEl.innerHTML = '<span class="diagram-placeholder">Error occurred</span>';
  } finally {
    runBtn.disabled = false;
  }
}

// ── Wire up ──────────────────────────────────────────────────
runBtn.addEventListener('click', runPlayground);

// Tab support in playground editor
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 4;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (!runBtn.disabled) runBtn.click();
  }
});

// Inline hints for playground
setupInlineHints('pg-editor');

})(); // end IIFE
