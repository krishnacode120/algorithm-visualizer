import { useEffect, useMemo, useState } from 'react';
import { useVisualizerStore } from '../store/visualizerStore';
import { GridEditMode } from '../store/visualizerStore';

export function InputPanel() {
  const {
    input,
    randomizeArray,
    setCustomArray,
    resetGrid,
    category,
    selectedId,
    gridEditMode,
    setGridEditMode,
    resetGraph,
    setGraphFromText,
    setSudokuFromText,
    resetSudoku,
    setQueensSize,
  } = useVisualizerStore();
  const [size, setSize] = useState(input.array.length);
  const [custom, setCustom] = useState(input.array.join(', '));
  const [graphText, setGraphText] = useState('');
  const [sudokuText, setSudokuText] = useState('');

  const graphValue = useMemo(() => input.graph.edges.map((edge) => `${edge.source}-${edge.target}:${edge.weight}`).join('\n'), [input.graph]);
  const sudokuValue = useMemo(() => input.sudoku.map((row) => row.map((value) => value || '.').join('')).join('\n'), [input.sudoku]);

  useEffect(() => {
    setCustom(input.array.join(', '));
    setSize(input.array.length);
  }, [input.array]);

  useEffect(() => setGraphText(graphValue), [graphValue]);
  useEffect(() => setSudokuText(sudokuValue), [sudokuValue]);

  const gridModes: { id: GridEditMode; label: string }[] = [
    { id: 'wall', label: 'Wall' },
    { id: 'erase', label: 'Erase' },
    { id: 'start', label: 'Start' },
    { id: 'end', label: 'End' },
  ];

  return (
    <aside className="side-panel">
      <h2>Input</h2>
      {category === 'sorting' && (
        <div className="input-group">
          <label>
            Array size
            <input type="number" min="0" max="80" value={size} onChange={(event) => setSize(Number(event.target.value))} />
          </label>
          <button type="button" onClick={() => randomizeArray(size)}>Randomize</button>
          <label>
            Custom array
            <textarea value={custom} onChange={(event) => setCustom(event.target.value)} onBlur={() => setCustomArray(custom)} />
          </label>
        </div>
      )}
      {category === 'pathfinding' && (
        <div className="input-group">
          <div className="mini-picker vertical">
            {gridModes.map((mode) => (
              <button type="button" key={mode.id} className={gridEditMode === mode.id ? 'active' : ''} onClick={() => setGridEditMode(mode.id)}>{mode.label}</button>
            ))}
          </div>
          <button type="button" onClick={resetGrid}>Reset grid</button>
          <span className="field-note">Click cells in the grid to paint walls, erase cells, or move start/end.</span>
        </div>
      )}
      {category === 'graph' && (
        <div className="input-group">
          <label>
            Weighted edges
            <textarea value={graphText} onChange={(event) => setGraphText(event.target.value)} onBlur={() => setGraphFromText(graphText)} />
          </label>
          <button type="button" onClick={resetGraph}>Reset graph</button>
          <span className="field-note">Use one edge per line, for example A-B:4. Nodes are positioned automatically.</span>
        </div>
      )}
      {category === 'backtracking' && selectedId === 'sudoku' && (
        <div className="input-group">
          <label>
            Sudoku board
            <textarea className="mono-textarea" value={sudokuText} onChange={(event) => setSudokuText(event.target.value)} onBlur={() => setSudokuFromText(sudokuText)} />
          </label>
          <button type="button" onClick={resetSudoku}>Reset puzzle</button>
          <span className="field-note">Use 9 rows. Digits are givens; 0 or . means empty.</span>
        </div>
      )}
      {category === 'backtracking' && selectedId === 'n-queens' && (
        <div className="input-group">
          <label>
            Board size
            <input type="number" min="1" max="10" value={input.queensSize} onChange={(event) => setQueensSize(Number(event.target.value))} />
          </label>
          <span className="field-note">Sizes 2 and 3 intentionally show no solution.</span>
        </div>
      )}
      <div className="hint-block">
        <b>Edge cases included</b>
        <span>Empty arrays, duplicate values, grid walls, and disconnected graph behavior are handled by the generators.</span>
      </div>
    </aside>
  );
}
