# DSAVis — Data Structure Visualizer

An interactive, browser-based visualizer for learning data structures through **step-by-step code execution**, **live animated diagrams**, and **interactive Python mode** — all in the browser, no install required.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

🔗 **Live Site:** [mrsiuuuu-x1.github.io/DSA-Visualization](https://mrsiuuuu-x1.github.io/DSA-Visualization)

---

## Data Structures Covered

| Section | Operations |
| --- | --- |
| **Array** | append, access by index, pop, insert |
| **Linked List** | append, delete (mid-node and head) with pointer visualization |
| **Stack** | push, pop — array-based with `TopOfStack` pointer |
| **Queue** | enqueue, dequeue — array-based with `HeadPointer`, `TailPointer`, `NumberItems` |
| **Binary Tree** | insert, traverse — array-based with private attributes, getters/setters, index pointers |

---

## Features

### Step Mode
- Walk through each line of Python code one step at a time
- Live diagrams update as each operation executes
- Plain-English callout explains what's happening at every step
- Auto-play mode steps through automatically at a set interval
- Speed slider — control animation speed from slow to fast in real time
- Syntax-highlighted code with colour-coded keywords, functions, strings, and numbers

### Interactive Mode
- Write your own Python code and watch it animate live
- Tag any variable with `# @visualize varName` to track it
- Line-by-line code highlighting during playback
- Record/pointer table — linked list shows `val` and `next` fields per node
- **✎ Edit button** — return to the editor from the code view at any time
- **Smart error messages** — plain-English explanations instead of raw Python errors
- **Inline hints** — warning appears as you type if a class name is used in `@visualize` or an unsupported `import` is detected

### Diagrams
- Linked list node chain with `val | next` cells and connecting arrows
- Delete visualization — deleted node turns red, skip arrow shows pointer re-linking
- Stack with `▲ TOP` label and `TopOfStack` counter
- Queue with Front/Rear labels and Head/Tail/Count display
- Binary tree SVG with index labels and L/D/R array table below

---

## Interactive Mode — Usage Guide

Add `# @visualize varName` anywhere in your code to watch a variable animate.

**Arrays and lists** — tag the list directly:
```python
arr = []
arr.append(10)
arr.append(20)
# @visualize arr
```

**Linked lists** — add a `to_list()` method and reassign after each operation:
```python
ll = LinkedList()
snapshot = ll.to_list()

ll.append(10)
snapshot = ll.to_list()

ll.append(20)
snapshot = ll.to_list()

# @visualize snapshot
```

**Binary trees** — `snapshot()` must return `[[leftIdx, data, rightIdx], ...]` per node:
```python
def snapshot(self):
    return [[self.__Tree[i].GetLeft(), self.__Tree[i].GetData(), self.__Tree[i].GetRight()]
            for i in range(self.__NumberNodes)]

Tree = TheTree.snapshot()
TheTree.InsertNode(Node(10))
Tree = TheTree.snapshot()
# @visualize Tree
```

> **Note:** `import` statements are not supported — the visualizer runs Python in-browser via [Skulpt](https://skulpt.org/).

---

## Getting Started

No install needed. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/mrsiuuuu-x1/DSA-Visualization.git
cd DSA-Visualization
# open index.html in your browser
```

Or visit the live site directly — no setup required.

---

## File Structure

```
DSA-Visualization/
├── index.html    # HTML structure — 5 sections, one per data structure
├── style.css     # Dark theme, animations, responsive layout
├── app.js        # All visualizer logic, step definitions, diagram rendering
├── favicon.svg   # Browser tab icon
└── README.md
```

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript — zero dependencies, zero build step
- [Skulpt](https://skulpt.org/) — in-browser Python interpreter for Interactive Mode
- SVG for Binary Tree rendering
- Google Fonts: JetBrains Mono + Syne
- Hosted via GitHub Pages

---

## Roadmap

- [ ] Sorting algorithms (Bubble Sort, Insertion Sort)
- [ ] Hash Tables
- [ ] Heap / Priority Queue
- [ ] Light theme toggle

---

## License

MIT — free to use, share, and modify.