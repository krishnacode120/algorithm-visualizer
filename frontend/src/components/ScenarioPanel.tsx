import { useMemo, useState } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';

export function ScenarioPanel() {
  const { selectedId, category, input, speed, applyPreset, importScenario } = useVisualizerStore();
  const [scenarioText, setScenarioText] = useState('');
  const [message, setMessage] = useState('');

  const exportText = useMemo(() => JSON.stringify({ selectedId, category, speed, input }, null, 2), [selectedId, category, speed, input]);

  const copyScenario = async () => {
    await navigator.clipboard?.writeText(exportText);
    setMessage('Scenario copied.');
  };

  const importCurrent = () => {
    const ok = importScenario(scenarioText);
    setMessage(ok ? 'Scenario imported.' : 'Import failed. Check the JSON shape.');
  };

  return (
    <section className="scenario-band">
      <h2>Scenario Lab</h2>
      <div className="mini-picker">
        <button type="button" onClick={() => applyPreset('classic-sort')}>Classic sort</button>
        <button type="button" onClick={() => applyPreset('maze')}>Maze grid</button>
        <button type="button" onClick={() => applyPreset('dense-graph')}>Dense graph</button>
        <button type="button" onClick={() => applyPreset('hard-sudoku')}>Sudoku</button>
        <button type="button" onClick={() => applyPreset('dp-demo')}>DP demo</button>
      </div>
      <label>
        Export current scenario
        <textarea className="scenario-text" value={exportText} readOnly />
      </label>
      <div className="control-row tight">
        <button type="button" onClick={copyScenario}>Copy JSON</button>
      </div>
      <label>
        Import scenario JSON
        <textarea className="scenario-text" value={scenarioText} onChange={(event) => setScenarioText(event.target.value)} />
      </label>
      <button type="button" onClick={importCurrent}>Import</button>
      {message && <span className="field-note">{message}</span>}
    </section>
  );
}
