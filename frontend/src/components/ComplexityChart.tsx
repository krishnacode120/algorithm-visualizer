export function ComplexityChart() {
  const points = Array.from({ length: 9 }, (_, i) => (i + 2) * 5);
  const maxY = Math.max(...points.map((n) => n * n));
  const mapX = (i: number) => 36 + i * 48;
  const mapY = (value: number) => 170 - (value / maxY) * 140;
  const line = (fn: (n: number) => number) => points.map((n, i) => `${mapX(i)},${mapY(fn(n))}`).join(' ');
  return (
    <section className="complexity-band">
      <h2>Complexity Growth</h2>
      <svg viewBox="0 0 460 190" role="img" aria-label="Complexity comparison chart">
        <polyline points={line((n) => n)} className="chart-line linear" />
        <polyline points={line((n) => n * Math.log2(n))} className="chart-line loglinear" />
        <polyline points={line((n) => n * n)} className="chart-line quadratic" />
        <g className="axis"><line x1="28" y1="172" x2="438" y2="172" /><line x1="30" y1="20" x2="30" y2="172" /></g>
      </svg>
      <div className="legend"><span className="linear">O(n)</span><span className="loglinear">O(n log n)</span><span className="quadratic">O(n^2)</span></div>
    </section>
  );
}
