import { useMemo } from 'react';
import { algorithms } from '../algorithms';
import { useVisualizerStore } from '../store/visualizerStore';

export function ComparisonPanel() {
  const { comparisonIds, toggleComparison, input } = useVisualizerStore();
  const options = useMemo(() => algorithms.filter((algorithm) => algorithm.category === 'sorting'), []);
  const rows = useMemo(() => comparisonIds.map((id) => {
    const algorithm = algorithms.find((item) => item.id === id)!;
    const steps = algorithm.createSteps(input);
    const last = steps.at(-1);
    return { algorithm, steps, last };
  }), [comparisonIds, input]);
  const maxSteps = Math.max(...rows.map((row) => row.steps.length), 1);

  return (
    <section className="comparison-band">
      <div className="comparison-header">
        <div>
          <h2>Comparison Mode</h2>
          <span className="section-subtitle">Compare sorting cost on the same input.</span>
        </div>
        <div className="mini-picker comparison-picker" aria-label="Select sorting algorithms to compare">
          {options.map((algorithm) => (
            <button type="button" className={comparisonIds.includes(algorithm.id) ? 'active' : ''} key={algorithm.id} onClick={() => toggleComparison(algorithm.id)}>
              {algorithm.name}
            </button>
          ))}
        </div>
      </div>
      <div className="comparison-grid">
        {!rows.length && <p className="empty-state">Choose at least one algorithm to compare.</p>}
        {rows.map(({ algorithm, last, steps }) => (
          <article className="comparison-card" key={algorithm.id}>
            <div className="comparison-title">
              <b>{algorithm.name}</b>
              <span className="complexity-badge">{algorithm.complexity.average ?? algorithm.complexity.worst}</span>
            </div>
            <div className="bar-track"><span style={{ width: `${(steps.length / maxSteps) * 100}%` }} /></div>
            <div className="comparison-metrics">
              <div><span>Steps</span><b>{last?.metrics.steps ?? 0}</b></div>
              <div><span>Comparisons</span><b>{last?.metrics.comparisons ?? 0}</b></div>
              <div><span>Swaps</span><b>{last?.metrics.swaps ?? 0}</b></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
