# DSAVis — Data Structure Visualizer

An interactive, browser-based visualizer for learning data structures through **step-by-step code execution** and **live animated diagrams** — all in Python.

![Status](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

🔗 **Live Site:** [mrsiuuuu-x1.github.io/DSA-Visualization](https://mrsiuuuu-x1.github.io/DSA-Visualization)

---

## Data Structures Covered

| Section | Implementation |
|---|---|
| **Array** | Python list — append, access by index, pop, insert |
| **Linked List** | Singly linked list with Node class and next pointers |
| **Stack** | Array-based stack using `TopOfStack` integer pointer |
| **Queue** | Array-based queue using `HeadPointer`, `TailPointer`, `NumberItems` |
| **Binary Tree** | Array-based BT with private attributes, getters/setters, index pointers |

---

## Features

- **Step-by-step execution** — walk through each line of Python code one at a time
- **Live diagrams** — watch the data structure update as each operation runs
- **Explanatory callouts** — every step has a plain-English explanation of what's happening
- **Auto-play mode** — step through automatically at a set interval
- **Syntax highlighting** — clean, readable Python code with colour-coded keywords
- **5 dedicated sections** — each data structure has its own independent page and controls
- **BT array table** — visualizes the underlying `__Tree` array alongside the tree diagram
- **Stack & Queue pointer display** — shows `TopOfStack`, `HeadPointer`, `TailPointer` updating live

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
├── index.html   # HTML structure — 5 sections, one per data structure
├── style.css    # Dark theme, animations, responsive layout
├── app.js       # All visualizer logic, step definitions, diagram rendering
└── README.md
```

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript — zero dependencies, zero build step
- SVG for Binary Tree rendering
- Google Fonts: JetBrains Mono + Syne
- Hosted via GitHub Pages

---

## Roadmap

- [ ] Sorting algorithms (Insertion Sort, Bubble Sort)
- [ ] User-input mode — insert your own values
- [ ] Light theme toggle
- [ ] Hash Tables
- [ ] Heap / Priority Queue

---

## License

MIT — free to use, share, and modify.