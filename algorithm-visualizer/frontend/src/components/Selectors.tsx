import { algorithms } from '../algorithms';
import { AlgorithmId, Category } from '../algorithms/types';
import { useVisualizerStore } from '../store/visualizerStore';

const categories: { id: Category; label: string }[] = [
  { id: 'sorting', label: 'Sorting' },
  { id: 'pathfinding', label: 'Pathfinding' },
  { id: 'graph', label: 'Graph' },
  { id: 'backtracking', label: 'Backtracking' },
];

export function Selectors() {
  const { category, selectedId, setCategory, setAlgorithm } = useVisualizerStore();
  return (
    <div className="topbar">
      <div className="brand">
        <strong>Advanced Algorithm Visualizer</strong>
        <span>Step through the decisions, not just the animation.</span>
      </div>
      <div className="segmented" aria-label="Algorithm category">
        {categories.map((item) => (
          <button className={item.id === category ? 'active' : ''} type="button" key={item.id} onClick={() => setCategory(item.id)}>{item.label}</button>
        ))}
      </div>
      <select value={selectedId} onChange={(event) => setAlgorithm(event.target.value as AlgorithmId)} aria-label="Algorithm">
        {algorithms.filter((algorithm) => algorithm.category === category).map((algorithm) => (
          <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>
        ))}
      </select>
    </div>
  );
}
