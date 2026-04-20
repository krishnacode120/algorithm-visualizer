# Advanced Algorithm Visualizer

An interactive React + TypeScript system for learning algorithms through animation, reversible execution, metrics, source-line highlighting, comparison mode, editable inputs, sound cues, and real-time explanations.

## Features

- Sorting: Bubble Sort, Merge Sort, Quick Sort, Heap Sort
- Pathfinding: BFS, DFS, Dijkstra, A*
- Graph algorithms: Kruskal MST, Prim MST
- Backtracking: Sudoku Solver, N-Queens
- Dynamic Programming: Fibonacci DP, 0/1 Knapsack
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
- Active learning panel with invariants, prediction prompts, misconception callouts, and score badges
- Scenario Lab with presets plus JSON import/export
- Drag-to-paint pathfinding grid editing
- Keyboard shortcuts, reduced-motion mode, and presentation mode

## Project Structure

```text
.
|-- docs/
|   `-- FEATURE_ROADMAP.md
|-- frontend/
|   |-- src/
|   |   |-- algorithms/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- store/
|   |   |-- utils/
|   |   `-- visualizers/
|   |-- index.html
|   |-- package.json
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- package.json
|-- vercel.json
`-- README.md
```

## Run Locally

```bash
npm --prefix frontend install
npm run dev
```

Open the printed Vite URL in your browser.

## Build

```bash
npm run build
```

The build output is written to `frontend/dist`.

## Deploy On Vercel

This repository includes a root `vercel.json` so Vercel can deploy the nested Vite app without manual command guessing.

Recommended import settings:

- Framework preset: Vite
- Install command: `npm ci --prefix frontend`
- Build command: `npm run build`
- Output directory: `frontend/dist`

The config also includes an SPA rewrite to `index.html`, immutable caching for hashed Vite assets, and a basic `nosniff` security header.

## Roadmap

See [docs/FEATURE_ROADMAP.md](docs/FEATURE_ROADMAP.md) for proposed upgrades covering new algorithm categories, active learning, gamification, authoring tools, performance improvements, accessibility, and classroom features.

Implemented roadmap batch:

- Dynamic Programming category with Fibonacci DP and 0/1 Knapsack
- Active Learning panel and prediction scoring
- Scenario presets and JSON import/export
- Drag-to-paint pathfinding editing
- Keyboard shortcuts, reduced-motion mode, and presentation mode

## Design Notes

Each algorithm produces a list of immutable `AlgorithmStep` states. The playback store keeps a current index into that history, which makes reverse execution deterministic and cheap. Visualizers read the same state shape while rendering the appropriate view: Canvas for sorting, CSS grid for pathfinding and backtracking, and SVG for graph algorithms.

The explanation panel is tied directly to the emitted state, so every visual action has an accompanying reason and a highlighted pseudocode line. Backtracking solvers report invalid and unsolved inputs explicitly instead of marking every run as successful.
