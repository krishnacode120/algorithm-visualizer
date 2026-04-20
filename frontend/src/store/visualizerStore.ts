import { create } from 'zustand';
import { AlgorithmId, AlgorithmInput, AlgorithmStep, Category, GridCell } from '../algorithms/types';
import { algorithms, getAlgorithm } from '../algorithms';
import { createDefaultInput, createGraph, createGrid, defaultSudoku, randomArray } from '../utils/fixtures';

export type GridEditMode = 'wall' | 'erase' | 'start' | 'end';

interface VisualizerState {
  selectedId: AlgorithmId;
  category: Category;
  input: AlgorithmInput;
  steps: AlgorithmStep[];
  currentIndex: number;
  isPlaying: boolean;
  soundEnabled: boolean;
  speed: number;
  gridEditMode: GridEditMode;
  comparisonIds: AlgorithmId[];
  setAlgorithm: (id: AlgorithmId) => void;
  setCategory: (category: Category) => void;
  setSpeed: (speed: number) => void;
  toggleSound: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  advancePlayback: () => void;
  randomizeArray: (size?: number) => void;
  setCustomArray: (value: string) => void;
  setGridEditMode: (mode: GridEditMode) => void;
  editGridCell: (row: number, col: number) => void;
  resetGrid: () => void;
  resetGraph: () => void;
  setGraphFromText: (value: string) => void;
  setSudokuFromText: (value: string) => void;
  resetSudoku: () => void;
  setQueensSize: (size: number) => void;
  toggleComparison: (id: AlgorithmId) => void;
}

const input = createDefaultInput();
const initialAlgorithm = getAlgorithm('bubble-sort');
const createSteps = (id: AlgorithmId, nextInput: AlgorithmInput) => getAlgorithm(id).createSteps(nextInput);
const rebuild = (state: VisualizerState, nextInput: AlgorithmInput) => ({
  input: nextInput,
  steps: createSteps(state.selectedId, nextInput),
  currentIndex: 0,
  isPlaying: false,
});

const parseSudoku = (value: string) => {
  const rows = value
    .trim()
    .split(/\n|;/)
    .map((row) => row.replace(/[^0-9.]/g, '').slice(0, 9));
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => {
      const char = rows[row]?.[col] ?? '0';
      return char === '.' ? 0 : Number(char) || 0;
    }),
  );
};

const parseGraph = (value: string) => {
  const edges = value
    .split(/\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^([A-Za-z0-9]+)\s*(?:-|->|\s)\s*([A-Za-z0-9]+)\s*(?::|\s)\s*(\d+(?:\.\d+)?)$/);
      if (!match) return undefined;
      const [, source, target, rawWeight] = match;
      return { id: `${source}-${target}-${index}`, source, target, weight: Math.max(1, Math.round(Number(rawWeight))) };
    })
    .filter((edge): edge is { id: string; source: string; target: string; weight: number } => Boolean(edge));
  const ids = [...new Set(edges.flatMap((edge) => [edge.source, edge.target]))];
  if (!edges.length || ids.length < 2) return undefined;
  const centerX = 280;
  const centerY = 165;
  const radius = 120;
  const nodes = ids.map((id, index) => {
    const angle = (Math.PI * 2 * index) / ids.length - Math.PI / 2;
    return { id, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
  });
  return { nodes, edges };
};

const cloneGridForEdit = (grid: GridCell[][]) => grid.map((gridRow) => gridRow.map((cell) => ({ ...cell })));

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  selectedId: 'bubble-sort',
  category: 'sorting',
  input,
  steps: initialAlgorithm.createSteps(input),
  currentIndex: 0,
  isPlaying: false,
  soundEnabled: true,
  speed: 450,
  gridEditMode: 'wall',
  comparisonIds: ['bubble-sort', 'merge-sort', 'quick-sort'],
  setAlgorithm: (id) => {
    const algorithm = getAlgorithm(id);
    const steps = createSteps(id, get().input);
    set({ selectedId: id, category: algorithm.category, steps, currentIndex: 0, isPlaying: false });
  },
  setCategory: (category) => {
    const id = algorithms.find((algorithm) => algorithm.category === category)!.id;
    const steps = createSteps(id, get().input);
    set({ category, selectedId: id, steps, currentIndex: 0, isPlaying: false });
  },
  setSpeed: (speed) => set({ speed }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  play: () => set((state) => ({ isPlaying: true, currentIndex: state.currentIndex >= state.steps.length - 1 ? 0 : state.currentIndex })),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentIndex: 0, isPlaying: false }),
  stepForward: () => set((state) => ({ currentIndex: Math.min(state.currentIndex + 1, state.steps.length - 1), isPlaying: false })),
  stepBackward: () => set((state) => ({ currentIndex: Math.max(state.currentIndex - 1, 0), isPlaying: false })),
  advancePlayback: () => set((state) => {
    const nextIndex = Math.min(state.currentIndex + 1, state.steps.length - 1);
    return { currentIndex: nextIndex, isPlaying: nextIndex < state.steps.length - 1 };
  }),
  randomizeArray: (size) => {
    const nextInput = { ...get().input, array: randomArray(size ?? get().input.array.length) };
    set((state) => rebuild(state, nextInput));
  },
  setCustomArray: (value) => {
    const parsed = value.split(',').map((item) => Number(item.trim())).filter((item) => Number.isFinite(item));
    const nextInput = { ...get().input, array: parsed };
    set((state) => rebuild(state, nextInput));
  },
  setGridEditMode: (gridEditMode) => set({ gridEditMode }),
  editGridCell: (row, col) => {
    const { input: currentInput, gridEditMode } = get();
    const grid = cloneGridForEdit(currentInput.grid);
    const cell = grid[row]?.[col];
    if (!cell) return;
    if (gridEditMode === 'start' || gridEditMode === 'end') {
      grid.flat().forEach((item) => {
        if (item.kind === gridEditMode) item.kind = 'empty';
      });
      cell.kind = gridEditMode;
    } else if (gridEditMode === 'wall') {
      if (cell.kind !== 'start' && cell.kind !== 'end') cell.kind = 'wall';
    } else if (cell.kind !== 'start' && cell.kind !== 'end') {
      cell.kind = 'empty';
    }
    const nextInput = { ...currentInput, grid };
    set((state) => rebuild(state, nextInput));
  },
  resetGrid: () => {
    const nextInput = { ...get().input, grid: createGrid() };
    set((state) => rebuild(state, nextInput));
  },
  resetGraph: () => {
    const nextInput = { ...get().input, graph: createGraph() };
    set((state) => rebuild(state, nextInput));
  },
  setGraphFromText: (value) => {
    const graph = parseGraph(value);
    if (!graph) return;
    const nextInput = { ...get().input, graph };
    set((state) => rebuild(state, nextInput));
  },
  setSudokuFromText: (value) => {
    const nextInput = { ...get().input, sudoku: parseSudoku(value) };
    set((state) => rebuild(state, nextInput));
  },
  resetSudoku: () => {
    const nextInput = { ...get().input, sudoku: defaultSudoku() };
    set((state) => rebuild(state, nextInput));
  },
  setQueensSize: (size) => {
    const nextInput = { ...get().input, queensSize: Math.max(1, Math.min(10, Math.floor(size || 1))) };
    set((state) => rebuild(state, nextInput));
  },
  toggleComparison: (id) => set((state) => {
    const exists = state.comparisonIds.includes(id);
    const comparisonIds = exists ? state.comparisonIds.filter((item) => item !== id) : [...state.comparisonIds, id].slice(-3);
    return { comparisonIds };
  }),
}));
