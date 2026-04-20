import { create } from 'zustand';
import { AlgorithmId, AlgorithmInput, AlgorithmStep, Category } from '../algorithms/types';
import { algorithms, getAlgorithm } from '../algorithms';
import { createDefaultInput, createGrid, randomArray } from '../utils/fixtures';

interface VisualizerState {
  selectedId: AlgorithmId;
  category: Category;
  input: AlgorithmInput;
  steps: AlgorithmStep[];
  currentIndex: number;
  isPlaying: boolean;
  soundEnabled: boolean;
  speed: number;
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
  resetGrid: () => void;
  toggleComparison: (id: AlgorithmId) => void;
}

const input = createDefaultInput();
const initialAlgorithm = getAlgorithm('bubble-sort');
const createSteps = (id: AlgorithmId, nextInput: AlgorithmInput) => getAlgorithm(id).createSteps(nextInput);

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  selectedId: 'bubble-sort',
  category: 'sorting',
  input,
  steps: initialAlgorithm.createSteps(input),
  currentIndex: 0,
  isPlaying: false,
  soundEnabled: true,
  speed: 450,
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
    set((state) => ({ input: nextInput, steps: createSteps(state.selectedId, nextInput), currentIndex: 0, isPlaying: false }));
  },
  setCustomArray: (value) => {
    const parsed = value.split(',').map((item) => Number(item.trim())).filter((item) => Number.isFinite(item));
    const nextInput = { ...get().input, array: parsed };
    set((state) => ({ input: nextInput, steps: createSteps(state.selectedId, nextInput), currentIndex: 0, isPlaying: false }));
  },
  resetGrid: () => {
    const nextInput = { ...get().input, grid: createGrid() };
    set((state) => ({ input: nextInput, steps: createSteps(state.selectedId, nextInput), currentIndex: 0, isPlaying: false }));
  },
  toggleComparison: (id) => set((state) => {
    const exists = state.comparisonIds.includes(id);
    const comparisonIds = exists ? state.comparisonIds.filter((item) => item !== id) : [...state.comparisonIds, id].slice(-3);
    return { comparisonIds };
  }),
}));
