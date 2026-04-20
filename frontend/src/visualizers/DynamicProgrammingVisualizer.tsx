import { AlgorithmStep } from '../algorithms/types';

export function DynamicProgrammingVisualizer({ step }: { step: AlgorithmStep }) {
  const state = step.dp;
  if (!state) return null;

  return (
    <div className="dp-wrap">
      <div className="dp-table" style={{ gridTemplateColumns: `minmax(88px, auto) repeat(${state.table[0]?.length ?? 1}, minmax(42px, 1fr))` }}>
        <div className="dp-corner">state</div>
        {(state.colLabels ?? state.table[0]?.map((_, index) => String(index)) ?? []).map((label, index) => (
          <div className="dp-head" key={`col-${index}`}>{label}</div>
        ))}
        {state.table.map((row, rowIndex) => (
          row.map((value, colIndex) => {
            const active = state.activeCells?.includes(`${rowIndex},${colIndex}`);
            return (
              <div className="dp-row-fragment" key={`${rowIndex}-${colIndex}`}>
                {colIndex === 0 && <div className="dp-head row-head" key={`row-${rowIndex}`}>{state.rowLabels?.[rowIndex] ?? `row ${rowIndex}`}</div>}
                <div className={`dp-cell ${active ? 'active' : ''}`}>{value}</div>
              </div>
            );
          })
        ))}
      </div>
      {state.summary && <p className="dp-summary">{state.summary}</p>}
    </div>
  );
}
