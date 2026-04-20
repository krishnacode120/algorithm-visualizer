import { ComparisonPanel } from '../components/ComparisonPanel';
import { ComplexityChart } from '../components/ComplexityChart';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { InputPanel } from '../components/InputPanel';
import { PlaybackControls } from '../components/PlaybackControls';
import { Selectors } from '../components/Selectors';
import { VisualizerStage } from '../visualizers/VisualizerStage';

export function App() {
  return (
    <div className="app-shell">
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
      </div>
    </div>
  );
}
