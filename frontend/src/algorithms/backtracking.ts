import { AlgorithmDefinition, AlgorithmInput, AlgorithmStep, Metrics } from './types';

const base = (): Metrics => ({ steps: 0, comparisons: 0, swaps: 0, memory: 0 });
const clone = (b: number[][]) => b.map((row) => [...row]);

const step = (m: Metrics, board: number[][], action: AlgorithmStep['action'], focus: [number, number] | undefined, title: string, explanation: string, why: string, line: number, invalidCells: string[] = []): AlgorithmStep => ({
  id: m.steps,
  action,
  backtracking: { board: clone(board), focus, invalidCells },
  title,
  explanation,
  why,
  line,
  metrics: { ...m, memory: board.length * board[0].length * 8 },
});

function sudokuValid(board: number[][], row: number, col: number, value: number) {
  for (let i = 0; i < 9; i += 1) {
    if (board[row][i] === value || board[i][col] === value) return false;
  }
  const sr = Math.floor(row / 3) * 3;
  const sc = Math.floor(col / 3) * 3;
  for (let r = sr; r < sr + 3; r += 1) for (let c = sc; c < sc + 3; c += 1) if (board[r][c] === value) return false;
  return true;
}

function* sudoku(input: number[][]): Generator<AlgorithmStep> {
  const board = clone(input);
  const m = base();
  function* solve(): Generator<AlgorithmStep, boolean> {
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (board[r][c] !== 0) continue;
        for (let value = 1; value <= 9; value += 1) {
          m.steps += 1;
          m.comparisons += 1;
          yield step(m, board, 'compare', [r, c], 'Try candidate digit', `Testing ${value} at row ${r + 1}, column ${c + 1}.`, 'Sudoku search tries legal candidates and abandons branches that violate constraints.', 6);
          if (sudokuValid(board, r, c, value)) {
            board[r][c] = value;
            m.steps += 1;
            yield step(m, board, 'place', [r, c], 'Place valid candidate', `${value} fits this row, column, and 3x3 box.`, 'A locally valid placement may lead to a full solution, so recursion continues.', 8);
            if (yield* solve()) return true;
            board[r][c] = 0;
            m.steps += 1;
            yield step(m, board, 'remove', [r, c], 'Backtrack', `Removed ${value} because later cells became impossible.`, 'Backtracking retreats when a choice prevents completion.', 11);
          } else {
            yield step(m, board, 'reject', [r, c], 'Reject candidate', `${value} conflicts with an existing digit.`, 'Invalid choices are pruned immediately instead of explored.', 13, [`${r},${c}`]);
          }
        }
        return false;
      }
    }
    return true;
  }
  yield* solve();
  yield step({ ...m, steps: m.steps + 1 }, board, 'complete', undefined, 'Sudoku solved', 'Every empty cell has been filled consistently.', 'The solver found assignments satisfying all row, column, and box constraints.', 15);
}

function queensSafe(board: number[][], row: number, col: number) {
  for (let r = 0; r < row; r += 1) {
    if (board[r][col] === 1) return false;
    const d = row - r;
    if (board[r][col - d] === 1 || board[r][col + d] === 1) return false;
  }
  return true;
}

function* queens(size: number): Generator<AlgorithmStep> {
  const board = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  const m = base();
  function* place(row: number): Generator<AlgorithmStep, boolean> {
    if (row === size) return true;
    for (let col = 0; col < size; col += 1) {
      m.steps += 1;
      m.comparisons += 1;
      yield step(m, board, 'compare', [row, col], 'Test queen position', `Checking row ${row + 1}, column ${col + 1}.`, 'N-Queens places one queen per row and checks columns and diagonals.', 5);
      if (queensSafe(board, row, col)) {
        board[row][col] = 1;
        m.steps += 1;
        yield step(m, board, 'place', [row, col], 'Place queen', `Column ${col + 1} has no attacking queen.`, 'This position keeps the partial board valid, so the next row can be attempted.', 7);
        if (yield* place(row + 1)) return true;
        board[row][col] = 0;
        m.steps += 1;
        yield step(m, board, 'remove', [row, col], 'Remove queen', `Backtracking from row ${row + 1}, column ${col + 1}.`, 'A later row had no valid position, so this earlier choice must change.', 10);
      } else {
        yield step(m, board, 'reject', [row, col], 'Reject attacked square', 'A queen would be attacked on this square.', 'Backtracking avoids branches that already break the rules.', 12, [`${row},${col}`]);
      }
    }
    return false;
  }
  yield* place(0);
  yield step({ ...m, steps: m.steps + 1 }, board, 'complete', undefined, 'Queens placed', `Solved ${size}-Queens with one queen per row.`, 'No queens share a column or diagonal, so no pair attacks another.', 14);
}

export const backtrackingAlgorithms: AlgorithmDefinition[] = [
  { id: 'sudoku', name: 'Sudoku Solver', category: 'backtracking', complexity: { worst: 'O(9^m)', space: 'O(m)' }, code: ['find empty cell', 'for digit 1..9', '  test row, column, box', '  place if valid', '  recursively solve rest', '  remove on failure'], createSteps: (input: AlgorithmInput) => [...sudoku(input.sudoku)] },
  { id: 'n-queens', name: 'N-Queens', category: 'backtracking', complexity: { worst: 'O(n!)', space: 'O(n^2)' }, code: ['place one queen per row', 'for each column', '  test column and diagonals', '  place if safe', '  recurse to next row', '  remove on failure'], createSteps: (input) => [...queens(input.queensSize)] },
];
