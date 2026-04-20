import { getAlgorithm } from '../algorithms';
import { useVisualizerStore } from '../store/visualizerStore';
import { BacktrackingVisualizer } from './BacktrackingVisualizer';
import { DynamicProgrammingVisualizer } from './DynamicProgrammingVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { GridVisualizer } from './GridVisualizer';
import { SortingCanvas } from './SortingCanvas';

export function VisualizerStage() {
  const { selectedId, steps, currentIndex } = useVisualizerStore();
  const algorithm = getAlgorithm(selectedId);
  const step = steps[currentIndex] ?? steps[0];
  return (
    <main className="stage">
      <div className="stage-header">
        <div>
          <h1>{algorithm.name}</h1>
          <span>{algorithm.category}</span>
        </div>
      </div>
      <div className="visual-frame">
        {algorithm.category === 'sorting' && <SortingCanvas step={step} />}
        {algorithm.category === 'pathfinding' && <GridVisualizer step={step} />}
        {algorithm.category === 'graph' && <GraphVisualizer step={step} />}
        {algorithm.category === 'backtracking' && <BacktrackingVisualizer step={step} />}
        {algorithm.category === 'dynamic-programming' && <DynamicProgrammingVisualizer step={step} />}
      </div>
    </main>
  );
}
