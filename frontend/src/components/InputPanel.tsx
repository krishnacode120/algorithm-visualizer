import { useState } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';

export function InputPanel() {
  const { input, randomizeArray, setCustomArray, resetGrid, category } = useVisualizerStore();
  const [size, setSize] = useState(input.array.length);
  const [custom, setCustom] = useState(input.array.join(', '));

  return (
    <aside className="side-panel">
      <h2>Input</h2>
      <label>
        Array size
        <input type="number" min="0" max="80" value={size} onChange={(event) => setSize(Number(event.target.value))} />
      </label>
      <button type="button" onClick={() => { randomizeArray(size); setCustom(useVisualizerStore.getState().input.array.join(', ')); }}>Randomize</button>
      <label>
        Custom array
        <textarea value={custom} onChange={(event) => setCustom(event.target.value)} onBlur={() => setCustomArray(custom)} />
      </label>
      {category === 'pathfinding' && <button type="button" onClick={resetGrid}>Reset grid</button>}
      <div className="hint-block">
        <b>Edge cases included</b>
        <span>Empty arrays, duplicate values, grid walls, and disconnected graph behavior are handled by the generators.</span>
      </div>
    </aside>
  );
}
