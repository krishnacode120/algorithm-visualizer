# 🧠 Advanced Algorithm Visualizer

An **interactive, production-grade Algorithm Visualizer** built with **React + TypeScript** that goes beyond basic animations.
This system focuses on **deep understanding, reversible execution, real-time explanations, and analytical insights**.

---

# 🚀 Overview

This project is designed as a **complete learning and exploration platform** for algorithms.

Unlike traditional visualizers, it provides:

* Step-by-step execution with **time travel debugging**
* Real-time **decision explanations**
* Multi-algorithm **comparison mode**
* Interactive **learning and prediction system**

👉 Goal:

> Help users **understand how and why algorithms work**, not just see them.

---

# ✨ Key Features

## 🧠 Algorithm Coverage

### 🔢 Sorting Algorithms

* Bubble Sort
* Merge Sort
* Quick Sort
* Heap Sort

### 🧭 Pathfinding Algorithms

* Breadth-First Search (BFS)
* Depth-First Search (DFS)
* Dijkstra's Algorithm
* A* Search

### 🌐 Graph Algorithms

* Kruskal’s Minimum Spanning Tree
* Prim’s Minimum Spanning Tree

### 🧩 Backtracking Algorithms

* Sudoku Solver
* N-Queens

### 📊 Dynamic Programming

* Fibonacci (DP)
* 0/1 Knapsack

---

## 🎮 Interactive Execution Engine

* Generator-based algorithm execution
* Emits **immutable step states**
* Enables:

  * ▶ Play
  * ⏸ Pause
  * ⏭ Step forward
  * ⏮ Step backward
  * 🔄 Reset
  * ⚡ Speed control

---

## ⏳ Time Travel Debugger

* Navigate through every state
* Jump to any step instantly
* Replay execution like a timeline

---

## 🧠 Explanation Engine

Each step includes:

* ✅ What is happening
* 🤔 Why it is happening

Example:

> “Swapping because left element is greater than right, violating sorted order.”

---

## 📊 Metrics Dashboard

Real-time metrics:

* Time complexity (theoretical)
* Steps executed
* Comparisons count
* Swap count
* Approximate memory usage

---

## ⚖️ Algorithm Comparison Mode

* Run up to **3 algorithms simultaneously**
* Compare:

  * Execution time
  * Steps
  * Efficiency

---

## 🎯 Active Learning System

* Prediction prompts:

  > “What will happen next?”
* Score tracking
* Misconception detection
* Learning badges

---

## 🎛️ Scenario Lab

* Predefined scenarios
* JSON import/export
* Custom experiment creation

---

## 🎨 Visual Systems

* Sorting → Canvas bars
* Pathfinding → Grid system
* Graph → SVG nodes + edges
* Backtracking → Grid + overlays

---

## 🧩 Advanced UI Features

* Drag-to-paint grid editing
* Custom array input
* Editable graph edges (`A-B:4`)
* Editable Sudoku boards
* Adjustable N-Queens board size

---

## 🔊 Sound Feedback

* Action-based sound cues
* Toggle on/off

---

## 📈 Complexity Visualization

* Growth charts for:

  * O(n)
  * O(n log n)
  * O(n²)

---

## 🎹 Accessibility & UX

* Keyboard shortcuts
* Reduced motion mode
* Presentation mode

---

# 🏗️ Project Structure

```text
.
|-- docs/
|   `-- FEATURE_ROADMAP.md
|-- frontend/
|   |-- src/
|   |   |-- algorithms/      # Algorithm implementations
|   |   |-- components/      # UI components
|   |   |-- pages/           # Main pages
|   |   |-- store/           # State management
|   |   |-- utils/           # Helpers
|   |   `-- visualizers/     # Rendering systems
|   |-- index.html
|   |-- package.json
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- package.json
|-- vercel.json
`-- README.md
```

---

# ⚙️ How It Works

## 🔄 Execution Model

Each algorithm is implemented as a **generator**:

```ts
yield {
  array: [...],
  activeIndices: [i, j],
  action: "compare",
  explanation: "Comparing adjacent elements"
};
```

---

## 🧠 State System

* All steps are stored as **immutable states**
* Playback system uses an index pointer
* Enables:

  * reverse execution
  * deterministic replay

---

## 🎨 Rendering System

Different visualizers use the same state:

| Algorithm Type | Renderer |
| -------------- | -------- |
| Sorting        | Canvas   |
| Pathfinding    | Grid     |
| Graph          | SVG      |
| Backtracking   | Grid     |

---

## 🧠 Explanation Binding

Each step includes:

* Action
* Reason
* Highlighted pseudocode line

---

# 🚀 Getting Started

## 📦 Install Dependencies

```bash
npm --prefix frontend install
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Open the displayed URL in your browser.

---

## 🏗️ Build Project

```bash
npm run build
```

Output will be in:

```text
frontend/dist
```

---

# 🌐 Deployment (Vercel)

This project includes a ready `vercel.json`.

### Recommended Settings:

* Framework: Vite
* Install:

```bash
npm ci --prefix frontend
```

* Build:

```bash
npm run build
```

* Output:

```text
frontend/dist
```

---

# 🛠️ Roadmap

See:

```
docs/FEATURE_ROADMAP.md
```

### Already Implemented:

* Dynamic Programming support
* Active learning system
* Scenario lab
* Advanced input editing
* Accessibility modes

---

# 🎯 Design Philosophy

This project is built around:

### ❌ Not just visualization

### ✅ Understanding + reasoning + interaction

It combines:

* Visualization 🎨
* Education 🎓
* Debugging 🧠
* Analysis 📊

---

# 🏆 Why This Project Stands Out

* Time-travel debugging
* Explanation-driven learning
* Multi-algorithm comparison
* Real-world usability

👉 This is not a demo project
👉 It is a **complete learning platform**

---

# 👨‍💻 Author

Krishna Moorthy
AI & Full Stack Developer

---

# ⭐ Final Note

This project demonstrates:

* Advanced frontend engineering
* Algorithm understanding
* System design thinking
* UX-focused learning tools

---

👉 If you find this useful, consider starring the repo ⭐
