import { useMemo } from 'react';
import { getAlgorithm } from '../algorithms';
import { useVisualizerStore } from '../store/visualizerStore';

const fallbackInvariant: Record<string, string> = {
  sorting: 'The algorithm preserves the same multiset of values while moving them toward sorted order.',
  pathfinding: 'Visited states are never reconsidered without a better reason, keeping the search finite.',
  graph: 'Chosen MST edges must connect components without forming cycles.',
  backtracking: 'Every recursive choice keeps the partial board valid before exploring deeper.',
  'dynamic-programming': 'Each table entry must represent a reusable subproblem with already-known dependencies.',
};

export function LearningPanel() {
  const {
    selectedId,
    category,
    steps,
    currentIndex,
    learningScore,
    reducedMotion,
    presentationMode,
    recordPrediction,
    toggleReducedMotion,
    togglePresentationMode,
  } = useVisualizerStore();
  const algorithm = getAlgorithm(selectedId);
  const step = steps[currentIndex] ?? steps[0];
  const badge = useMemo(() => {
    if (learningScore >= 15) return 'Algorithm Mentor';
    if (learningScore >= 8) return 'Invariant Builder';
    if (learningScore >= 3) return 'Prediction Streak';
    return 'Learning Mode';
  }, [learningScore]);

  return (
    <section className="learning-band">
      <div className="panel-title">
        <h2>Active Learning</h2>
        <span>{badge}</span>
      </div>
      <div className="learning-card">
        <b>Invariant</b>
        <p>{step?.invariant ?? fallbackInvariant[category]}</p>
      </div>
      <div className="learning-card">
        <b>Prediction checkpoint</b>
        <p>{step?.prompt ?? `Before stepping, predict the next decision in ${algorithm.name}.`}</p>
        <button type="button" onClick={recordPrediction}>I predicted it</button>
      </div>
      <div className="learning-card">
        <b>Misconception watch</b>
        <p>{step?.misconception ?? 'Animations show behavior; the invariant explains correctness.'}</p>
      </div>
      <div className="metric-grid compact">
        <span>Prediction score</span><b>{learningScore}</b>
        <span>Reduced motion</span><button type="button" className={reducedMotion ? 'active' : ''} onClick={toggleReducedMotion}>{reducedMotion ? 'On' : 'Off'}</button>
        <span>Presentation</span><button type="button" className={presentationMode ? 'active' : ''} onClick={togglePresentationMode}>{presentationMode ? 'On' : 'Off'}</button>
      </div>
      <p className="field-note">Shortcuts: Space play/pause, Right step, Left back, R reset, P presentation.</p>
    </section>
  );
}
