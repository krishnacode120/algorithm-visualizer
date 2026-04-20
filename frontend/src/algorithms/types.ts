export type Category = 'sorting' | 'pathfinding' | 'graph' | 'backtracking' | 'dynamic-programming';

export type AlgorithmId =
  | 'bubble-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'heap-sort'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'a-star'
  | 'kruskal'
  | 'prim'
  | 'sudoku'
  | 'n-queens'
  | 'fibonacci'
  | 'knapsack';

export type ActionKind =
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'partition'
  | 'visit'
  | 'enqueue'
  | 'relax'
  | 'choose'
  | 'reject'
  | 'place'
  | 'remove'
  | 'complete'
  | 'idle';

export type CellKind = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'frontier' | 'path';

export interface GridCell {
  row: number;
  col: number;
  kind: CellKind;
  distance?: number;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  active?: boolean;
  selected?: boolean;
  rejected?: boolean;
}

export interface BacktrackingState {
  board: number[][];
  focus?: [number, number];
  validCells?: string[];
  invalidCells?: string[];
}

export interface DynamicProgrammingState {
  table: (number | string)[][];
  activeCells?: string[];
  rowLabels?: string[];
  colLabels?: string[];
  summary?: string;
}

export interface Metrics {
  steps: number;
  comparisons: number;
  swaps: number;
  memory: number;
}

export interface AlgorithmStep {
  id: number;
  action: ActionKind;
  title: string;
  explanation: string;
  why: string;
  line: number;
  array?: number[];
  activeIndices?: number[];
  sortedIndices?: number[];
  grid?: GridCell[][];
  activeCells?: string[];
  graph?: { nodes: GraphNode[]; edges: GraphEdge[] };
  activeNodes?: string[];
  backtracking?: BacktrackingState;
  dp?: DynamicProgrammingState;
  variables?: Record<string, string | number>;
  invariant?: string;
  prompt?: string;
  misconception?: string;
  metrics: Metrics;
}

export interface AlgorithmDefinition {
  id: AlgorithmId;
  name: string;
  category: Category;
  complexity: {
    best?: string;
    average?: string;
    worst: string;
    space: string;
  };
  code: string[];
  createSteps: (input: AlgorithmInput) => AlgorithmStep[];
}

export interface AlgorithmInput {
  array: number[];
  grid: GridCell[][];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  sudoku: number[][];
  queensSize: number;
  dpSize: number;
  knapsackCapacity: number;
  knapsackItems: { weight: number; value: number }[];
}
