import { useEffect } from 'react';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { ComplexityChart } from '../components/ComplexityChart';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { InputPanel } from '../components/InputPanel';
import { LearningPanel } from '../components/LearningPanel';
import { PlaybackControls } from '../components/PlaybackControls';
import { ScenarioPanel } from '../components/ScenarioPanel';
import { Selectors } from '../components/Selectors';
import { useVisualizerStore } from '../store/visualizerStore';
import { VisualizerStage } from '../visualizers/VisualizerStage';

export function App() {
  const { isPlaying, play, pause, stepForward, stepBackward, reset, presentationMode, reducedMotion, togglePresentationMode } = useVisualizerStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (isPlaying) pause();
        else play();
      }
      if (event.key === 'ArrowRight') stepForward();
      if (event.key === 'ArrowLeft') stepBackward();
      if (event.key.toLowerCase() === 'r') reset();
      if (event.key.toLowerCase() === 'p') togglePresentationMode();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, pause, play, reset, stepBackward, stepForward, togglePresentationMode]);

  return (
    <div className={`app-shell ${presentationMode ? 'presentation-mode' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <Selectors />
      <PlaybackControls />
      <div className="workspace">
        <InputPanel />
        <VisualizerStage />
        <ExplanationPanel />
      </div>
      <div className="lower-panels">
        <ComparisonPanel />
        <ComplexityChart />
        <LearningPanel />
        <ScenarioPanel />
      </div>
    </div>
  );
}
