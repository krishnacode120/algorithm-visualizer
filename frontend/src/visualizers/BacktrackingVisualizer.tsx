import { AlgorithmStep } from '../algorithms/types';

export function BacktrackingVisualizer({ step }: { step: AlgorithmStep }) {
  const state = step.backtracking;
  if (!state) return null;
  const size = state.board.length;
  const isSudoku = size === 9 && state.board[0]?.length === 9;
  return (
    <div className={isSudoku ? 'sudoku-board' : 'queen-board'} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {state.board.flatMap((row, r) => row.map((value, c) => {
        const focus = state.focus?.[0] === r && state.focus[1] === c;
        const invalid = state.invalidCells?.includes(`${r},${c}`);
        return (
          <div key={`${r}-${c}`} className={`board-cell ${focus ? 'focus' : ''} ${invalid ? 'invalid' : ''} ${(r + c) % 2 ? 'odd' : 'even'}`}>
            {isSudoku ? (value || '') : value === 1 ? 'Q' : ''}
          </div>
        );
      }))}
    </div>
  );
}
