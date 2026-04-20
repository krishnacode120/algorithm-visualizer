import { AlgorithmStep } from '../algorithms/types';

export function GridVisualizer({ step }: { step: AlgorithmStep }) {
  const grid = step.grid ?? [];
  return (
    <div className="grid-visualizer" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, 1fr)` }}>
      {grid.flat().map((cell) => {
        const active = step.activeCells?.includes(`${cell.row},${cell.col}`);
        return <div key={`${cell.row}-${cell.col}`} className={`cell ${cell.kind} ${active ? 'active-cell' : ''}`} />;
      })}
    </div>
  );
}
