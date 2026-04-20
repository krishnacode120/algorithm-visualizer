import { AlgorithmInput, GraphEdge, GraphNode, GridCell } from '../algorithms/types';

export const randomArray = (size: number) =>
  Array.from({ length: Math.max(0, size) }, () => 8 + Math.floor(Math.random() * 92));

export const createGrid = (rows = 12, cols = 18): GridCell[][] =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const isStart = row === 2 && col === 2;
      const isEnd = row === rows - 3 && col === cols - 3;
      const wall = !isStart && !isEnd && ((row === 5 && col > 2 && col < cols - 4) || (col === 9 && row > 1 && row < rows - 3));
      return { row, col, kind: isStart ? 'start' : isEnd ? 'end' : wall ? 'wall' : 'empty' };
    }),
  );

export const createGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes: GraphNode[] = [
    { id: 'A', x: 90, y: 80 },
    { id: 'B', x: 240, y: 55 },
    { id: 'C', x: 390, y: 95 },
    { id: 'D', x: 130, y: 230 },
    { id: 'E', x: 305, y: 230 },
    { id: 'F', x: 470, y: 250 },
  ];
  const e = (source: string, target: string, weight: number): GraphEdge => ({
    id: `${source}-${target}`,
    source,
    target,
    weight,
  });
  return {
    nodes,
    edges: [e('A', 'B', 4), e('A', 'D', 2), e('B', 'C', 6), e('B', 'D', 1), e('B', 'E', 3), e('C', 'F', 2), e('D', 'E', 5), e('E', 'F', 4), e('C', 'E', 1)],
  };
};

export const defaultSudoku = (): number[][] => [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export const createDefaultInput = (): AlgorithmInput => ({
  array: [48, 18, 72, 31, 92, 44, 12, 64, 37, 83, 25, 55],
  grid: createGrid(),
  graph: createGraph(),
  sudoku: defaultSudoku(),
  queensSize: 8,
  dpSize: 8,
  knapsackCapacity: 10,
  knapsackItems: [
    { weight: 2, value: 6 },
    { weight: 3, value: 8 },
    { weight: 4, value: 10 },
    { weight: 5, value: 12 },
  ],
});

export const cloneGrid = (grid: GridCell[][]) => grid.map((row) => row.map((cell) => ({ ...cell })));

export const cloneGraph = (graph: { nodes: GraphNode[]; edges: GraphEdge[] }) => ({
  nodes: graph.nodes.map((node) => ({ ...node })),
  edges: graph.edges.map((edge) => ({ ...edge })),
});
