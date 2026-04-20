import { getAlgorithm } from '../algorithms';
import { useVisualizerStore } from '../store/visualizerStore';

export function ExplanationPanel() {
  const { steps, currentIndex, selectedId } = useVisualizerStore();
  const step = steps[currentIndex] ?? steps[0];
  const algorithm = getAlgorithm(selectedId);
  const metrics = step?.metrics ?? { steps: 0, comparisons: 0, swaps: 0, memory: 0 };

  return (
    <aside className="side-panel right-panel">
      <section>
        <h2>Decision</h2>
        <div className={`action-pill ${step?.action ?? 'idle'}`}>{step?.action ?? 'idle'}</div>
        <h3>{step?.title}</h3>
        <p>{step?.explanation}</p>
        <p className="why">{step?.why}</p>
      </section>
      <section>
        <h2>Metrics</h2>
        <div className="metric-grid">
          <span>Worst</span><b>{algorithm.complexity.worst}</b>
          <span>Space</span><b>{algorithm.complexity.space}</b>
          <span>Steps</span><b>{metrics.steps}</b>
          <span>Comparisons</span><b>{metrics.comparisons}</b>
          <span>Swaps</span><b>{metrics.swaps}</b>
          <span>Memory</span><b>{metrics.memory} B</b>
        </div>
      </section>
      {step?.variables && (
        <section>
          <h2>Live Variables</h2>
          <div className="metric-grid compact">
            {Object.entries(step.variables).map(([key, value]) => (
              <div className="metric-pair" key={key}>
                <span>{key}</span><b>{value}</b>
              </div>
            ))}
          </div>
        </section>
      )}
      <section>
        <h2>Code</h2>
        <ol className="code-view">
          {algorithm.code.map((line, index) => (
            <li key={line + index} className={index + 1 === step?.line ? 'current' : ''}>{line}</li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
