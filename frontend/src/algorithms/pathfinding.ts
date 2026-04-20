import { AlgorithmDefinition, AlgorithmInput, AlgorithmStep, GridCell, Metrics } from './types';
import { cloneGrid } from '../utils/fixtures';

const metrics = (): Metrics => ({ steps: 0, comparisons: 0, swaps: 0, memory: 0 });
const key = (r: number, c: number) => `${r},${c}`;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const findCell = (grid: GridCell[][], kind: GridCell['kind']) => grid.flat().find((cell) => cell.kind === kind)!;
const isOpen = (grid: GridCell[][], r: number, c: number) => grid[r]?.[c] && grid[r][c].kind !== 'wall';

function gridStep(m: Metrics, action: AlgorithmStep['action'], grid: GridCell[][], active: string[], title: string, explanation: string, why: string, line: number): AlgorithmStep {
  return { id: m.steps, action, grid: cloneGrid(grid), activeCells: active, title, explanation, why, line, metrics: { ...m, memory: grid.length * grid[0].length * 16 } };
}

const markPath = (grid: GridCell[][], parents: Map<string, string>, end: string) => {
  let cursor = end;
  while (parents.has(cursor)) {
    const [r, c] = cursor.split(',').map(Number);
    if (!['start', 'end'].includes(grid[r][c].kind)) grid[r][c].kind = 'path';
    cursor = parents.get(cursor)!;
  }
};

function* bfs(input: GridCell[][]): Generator<AlgorithmStep> {
  const grid = cloneGrid(input);
  const start = findCell(grid, 'start');
  const end = findCell(grid, 'end');
  const q: GridCell[] = [start];
  const visited = new Set([key(start.row, start.col)]);
  const parents = new Map<string, string>();
  const m = metrics();
  while (q.length) {
    const cell = q.shift()!;
    m.steps += 1;
    if (!['start', 'end'].includes(cell.kind)) cell.kind = 'visited';
    yield gridStep(m, 'visit', grid, [key(cell.row, cell.col)], 'Visit oldest frontier cell', `BFS is visiting (${cell.row}, ${cell.col}).`, 'A queue explores cells by distance, so the first time we reach a cell is via a shortest path in an unweighted grid.', 4);
    if (cell.row === end.row && cell.col === end.col) break;
    for (const [dr, dc] of dirs) {
      const nr = cell.row + dr;
      const nc = cell.col + dc;
      const nk = key(nr, nc);
      m.comparisons += 1;
      if (isOpen(grid, nr, nc) && !visited.has(nk)) {
        visited.add(nk);
        parents.set(nk, key(cell.row, cell.col));
        q.push(grid[nr][nc]);
        if (grid[nr][nc].kind === 'empty') grid[nr][nc].kind = 'frontier';
        m.steps += 1;
        yield gridStep(m, 'enqueue', grid, [nk], 'Add neighbor to queue', `Queued (${nr}, ${nc}) for later exploration.`, 'Neighbors are added after all earlier-distance cells, preserving BFS layer order.', 9);
      }
    }
  }
  markPath(grid, parents, key(end.row, end.col));
  yield gridStep({ ...m, steps: m.steps + 1 }, 'complete', grid, [], 'Path reconstruction complete', 'The highlighted path follows parent links back from the target.', 'Parents record the first route into each cell, which is shortest for BFS.', 12);
}

function* dfs(input: GridCell[][]): Generator<AlgorithmStep> {
  const grid = cloneGrid(input);
  const start = findCell(grid, 'start');
  const end = findCell(grid, 'end');
  const stack = [start];
  const visited = new Set<string>();
  const parents = new Map<string, string>();
  const m = metrics();
  while (stack.length) {
    const cell = stack.pop()!;
    const ck = key(cell.row, cell.col);
    if (visited.has(ck)) continue;
    visited.add(ck);
    m.steps += 1;
    if (!['start', 'end'].includes(cell.kind)) cell.kind = 'visited';
    yield gridStep(m, 'visit', grid, [ck], 'Dive into latest cell', `DFS is visiting (${cell.row}, ${cell.col}).`, 'A stack follows one branch deeply before backing up to alternatives.', 4);
    if (cell.row === end.row && cell.col === end.col) break;
    for (const [dr, dc] of dirs) {
      const nr = cell.row + dr;
      const nc = cell.col + dc;
      const nk = key(nr, nc);
      m.comparisons += 1;
      if (isOpen(grid, nr, nc) && !visited.has(nk)) {
        parents.set(nk, ck);
        stack.push(grid[nr][nc]);
        if (grid[nr][nc].kind === 'empty') grid[nr][nc].kind = 'frontier';
      }
    }
  }
  markPath(grid, parents, key(end.row, end.col));
  yield gridStep({ ...m, steps: m.steps + 1 }, 'complete', grid, [], 'Search complete', 'DFS found a route if one was reachable.', 'DFS is memory-light but does not guarantee the shortest path.', 11);
}

function* dijkstraLike(input: GridCell[][], useHeuristic: boolean): Generator<AlgorithmStep> {
  const grid = cloneGrid(input);
  const start = findCell(grid, 'start');
  const end = findCell(grid, 'end');
  const startKey = key(start.row, start.col);
  const endKey = key(end.row, end.col);
  const dist = new Map<string, number>([[startKey, 0]]);
  const parents = new Map<string, string>();
  const open = new Set([startKey]);
  const m = metrics();
  const h = (r: number, c: number) => Math.abs(r - end.row) + Math.abs(c - end.col);
  while (open.size) {
    const current = [...open].sort((a, b) => (dist.get(a)! + (useHeuristic ? h(...a.split(',').map(Number) as [number, number]) : 0)) - (dist.get(b)! + (useHeuristic ? h(...b.split(',').map(Number) as [number, number]) : 0)))[0];
    open.delete(current);
    const [r, c] = current.split(',').map(Number);
    m.steps += 1;
    if (!['start', 'end'].includes(grid[r][c].kind)) grid[r][c].kind = 'visited';
    yield gridStep(m, 'visit', grid, [current], useHeuristic ? 'Choose lowest f-score cell' : 'Choose nearest unsettled cell', `Selected (${r}, ${c}) with distance ${dist.get(current)}.`, useHeuristic ? 'A* adds a heuristic estimate so the search bends toward the goal.' : 'Dijkstra always expands the currently cheapest known route, guaranteeing shortest weighted paths.', 5);
    if (current === endKey) break;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      if (!isOpen(grid, nr, nc)) continue;
      const candidate = dist.get(current)! + 1;
      m.steps += 1;
      m.comparisons += 1;
      if (candidate < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, candidate);
        parents.set(nk, current);
        open.add(nk);
        if (grid[nr][nc].kind === 'empty') grid[nr][nc].kind = 'frontier';
        yield gridStep(m, 'relax', grid, [nk], 'Relax edge to neighbor', `Improved (${nr}, ${nc}) to cost ${candidate}.`, 'A better distance means future routes through this neighbor may become optimal.', 10);
      }
    }
  }
  markPath(grid, parents, endKey);
  yield gridStep({ ...m, steps: m.steps + 1 }, 'complete', grid, [], 'Shortest path resolved', 'The final path follows the cheapest parent chain to the goal.', useHeuristic ? 'With an admissible Manhattan heuristic, A* remains optimal on this grid.' : 'Dijkstra stops at the target after all cheaper alternatives are exhausted.', 14);
}

export const pathfindingAlgorithms: AlgorithmDefinition[] = [
  { id: 'bfs', name: 'BFS', category: 'pathfinding', complexity: { worst: 'O(V + E)', space: 'O(V)' }, code: ['push start into queue', 'while queue has cells', '  pop oldest cell', '  visit it', '  enqueue unvisited neighbors', 'reconstruct path'], createSteps: (input: AlgorithmInput) => [...bfs(input.grid)] },
  { id: 'dfs', name: 'DFS', category: 'pathfinding', complexity: { worst: 'O(V + E)', space: 'O(V)' }, code: ['push start into stack', 'while stack has cells', '  pop newest cell', '  visit it', '  push unvisited neighbors', 'backtrack if needed'], createSteps: (input) => [...dfs(input.grid)] },
  { id: 'dijkstra', name: 'Dijkstra', category: 'pathfinding', complexity: { worst: 'O((V + E) log V)', space: 'O(V)' }, code: ['set start distance to 0', 'choose lowest distance cell', 'visit it', 'relax each neighbor', 'update parent on improvement', 'stop at target'], createSteps: (input) => [...dijkstraLike(input.grid, false)] },
  { id: 'a-star', name: 'A*', category: 'pathfinding', complexity: { worst: 'O(E)', space: 'O(V)' }, code: ['set start g-score to 0', 'choose lowest g + heuristic', 'visit it', 'relax each neighbor', 'prefer cells closer to goal', 'reconstruct path'], createSteps: (input) => [...dijkstraLike(input.grid, true)] },
];
