import { AlgorithmStep } from '../algorithms/types';

export function GraphVisualizer({ step }: { step: AlgorithmStep }) {
  const graph = step.graph;
  if (!graph) return null;
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  return (
    <svg className="graph-svg" viewBox="0 0 560 330" role="img" aria-label="Graph visualization">
      {graph.edges.map((edge) => {
        const source = nodeById.get(edge.source)!;
        const target = nodeById.get(edge.target)!;
        const mx = (source.x + target.x) / 2;
        const my = (source.y + target.y) / 2;
        return (
          <g key={edge.id}>
            <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} className={`edge ${edge.selected ? 'selected' : ''} ${edge.active ? 'active' : ''} ${edge.rejected ? 'rejected' : ''}`} />
            <text x={mx} y={my - 6} className="edge-label">{edge.weight}</text>
          </g>
        );
      })}
      {graph.nodes.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="24" className={step.activeNodes?.includes(node.id) ? 'node active' : 'node'} />
          <text x={node.x} y={node.y + 5} textAnchor="middle" className="node-label">{node.id}</text>
        </g>
      ))}
    </svg>
  );
}
