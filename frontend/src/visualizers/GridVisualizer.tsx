import { useState } from 'react';
import { AlgorithmStep } from '../algorithms/types';
import { useVisualizerStore } from '../store/visualizerStore';

export function GridVisualizer({ step }: { step: AlgorithmStep }) {
  const editGridCell = useVisualizerStore((state) => state.editGridCell);
  const [painting, setPainting] = useState(false);
  const grid = step.grid ?? [];
  const paint = (row: number, col: number) => editGridCell(row, col);
  return (
    <div
      className="grid-visualizer"
      onPointerLeave={() => setPainting(false)}
      onPointerUp={() => setPainting(false)}
      style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, 1fr)` }}
    >
      {grid.flat().map((cell) => {
        const active = step.activeCells?.includes(`${cell.row},${cell.col}`);
        return (
          <button
            type="button"
            aria-label={`Edit cell ${cell.row}, ${cell.col}`}
            onPointerDown={(event) => {
              event.preventDefault();
              setPainting(true);
              paint(cell.row, cell.col);
            }}
            onPointerEnter={() => {
              if (painting) paint(cell.row, cell.col);
            }}
            key={`${cell.row}-${cell.col}`}
            className={`cell ${cell.kind} ${active ? 'active-cell' : ''}`}
          />
        );
      })}
    </div>
  );
}
