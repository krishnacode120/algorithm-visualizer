# Advanced Algorithm Visualizer

An interactive React + TypeScript system for learning algorithms through animation, reversible execution, metrics, source-line highlighting, comparison mode, and real-time explanations.

## Features

- Sorting: Bubble Sort, Merge Sort, Quick Sort, Heap Sort
- Pathfinding: BFS, DFS, Dijkstra, A*
- Graph algorithms: Kruskal MST, Prim MST
- Backtracking: Sudoku Solver, N-Queens
- Generator-style execution that emits intermediate states
- Playback controls: play, pause, step forward, step backward, reset, speed slider
- Decision explanation panel with "what" and "why" for every step
- Metrics dashboard for complexity, steps, comparisons, swaps, and approximate memory
- Comparison mode for up to three sorting algorithms
- Custom array input and random input generation
- Editable pathfinding grids with wall, erase, start, and end paint modes
- Editable graph edges using `A-B:4` style weighted input
- Editable Sudoku boards and bounded N-Queens board sizes
- Action-aware sound effects with a simple on/off toggle
- Complexity growth chart

## Project Structure

```text
algorithm-visualizer/
├── frontend/
│   ├── src/
│   │   ├── algorithms/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   └── visualizers/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Run Locally

```bash
cd algorithm-visualizer/frontend
npm install
npm run dev
```

Open the printed Vite URL in your browser.

## Build

```bash
cd algorithm-visualizer/frontend
npm run build
```

## Design Notes

Each algorithm produces a list of immutable `AlgorithmStep` states. The playback store keeps a current index into that history, which makes reverse execution deterministic and cheap. Visualizers read the same state shape while rendering the appropriate view: Canvas for sorting, CSS grid for pathfinding and backtracking, and SVG for graph algorithms.

The explanation panel is tied directly to the emitted state, so every visual action has an accompanying reason and a highlighted pseudocode line. Backtracking solvers now report invalid and unsolved inputs explicitly instead of marking every run as successful.
