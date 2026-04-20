import { AlgorithmStep } from '../algorithms/types';
import { useVisualizerStore } from '../store/visualizerStore';

export function GridVisualizer({ step }: { step: AlgorithmStep }) {
  const editGridCell = useVisualizerStore((state) => state.editGridCell);
  const grid = step.grid ?? [];
  return (
    <div className="grid-visualizer" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, 1fr)` }}>
      {grid.flat().map((cell) => {
        const active = step.activeCells?.includes(`${cell.row},${cell.col}`);
        return <button type="button" aria-label={`Edit cell ${cell.row}, ${cell.col}`} onClick={() => editGridCell(cell.row, cell.col)} key={`${cell.row}-${cell.col}`} className={`cell ${cell.kind} ${active ? 'active-cell' : ''}`} />;
      })}
    </div>
  );
}
