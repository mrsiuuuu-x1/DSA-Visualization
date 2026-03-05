# DSAvis — Data Structure Visualizer

An interactive, browser-based visualizer for learning data structures through **step-by-step code execution** and **animated diagrams** — all in Python.

![DSAvis Preview](https://img.shields.io/badge/status-ready-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## Data Structures Covered

| Section | Structures |
|---|---|
| **Arrays & Linked Lists** | Python lists, singly linked list |
| **Stacks & Queues** | Stack (LIFO), Queue with `deque` (FIFO) |
| **Trees & Graphs** | Binary Search Tree insertion, BFS traversal |

## Features

- **Step-by-step execution** — walk through each line of Python code one at a time
- **Live diagrams** — watch the data structure change as each operation runs
- **Auto-play mode** — sit back and watch the animation
- **Explanatory callouts** — every step has a plain-English explanation
- **Syntax highlighting** — clean, readable Python code display
- **Tab switching** — toggle between related structures (e.g. Stack ↔ Queue)

## Getting Started

No install needed. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/YOUR_USERNAME/dsavis.git
cd dsavis
open index.html   # or double-click it
```

## File Structure

```
dsavis/
├── index.html   # Main HTML structure
├── style.css    # All styles (dark theme, animations)
├── app.js       # All visualizer logic
└── README.md    # This file
```

## Tech Stack

- Vanilla HTML, CSS, JavaScript — zero dependencies, zero build step
- SVG for tree/graph rendering
- Google Fonts (JetBrains Mono + Syne)

## Roadmap

- [ ] Hash Tables
- [ ] Heap / Priority Queue
- [ ] Merge Sort / Quick Sort visualizer
- [ ] User-input mode (insert your own values)
- [ ] Light theme toggle

## License

MIT — free to use, share, and modify.