import { AlgorithmDefinition, AlgorithmInput, AlgorithmStep, GraphEdge, Metrics } from './types';
import { cloneGraph } from '../utils/fixtures';

const base = (): Metrics => ({ steps: 0, comparisons: 0, swaps: 0, memory: 0 });

const step = (m: Metrics, graph: AlgorithmInput['graph'], action: AlgorithmStep['action'], activeNodes: string[], title: string, explanation: string, why: string, line: number): AlgorithmStep => ({
  id: m.steps,
  action,
  graph: cloneGraph(graph),
  activeNodes,
  title,
  explanation,
  why,
  line,
  metrics: { ...m, memory: graph.nodes.length * 32 + graph.edges.length * 24 },
});

function* kruskal(input: AlgorithmInput['graph']): Generator<AlgorithmStep> {
  const graph = cloneGraph(input);
  const parent = new Map(graph.nodes.map((n) => [n.id, n.id]));
  const find = (x: string): string => (parent.get(x) === x ? x : find(parent.get(x)!));
  const m = base();
  for (const edge of [...graph.edges].sort((a, b) => a.weight - b.weight)) {
    m.steps += 1;
    m.comparisons += 1;
    edge.active = true;
    yield step(m, graph, 'compare', [edge.source, edge.target], 'Inspect lightest remaining edge', `Considering ${edge.source}-${edge.target} with weight ${edge.weight}.`, 'Kruskal grows an MST by always testing the next cheapest edge.', 4);
    const a = find(edge.source);
    const b = find(edge.target);
    if (a !== b) {
      parent.set(a, b);
      graph.edges.find((e) => e.id === edge.id)!.selected = true;
      m.steps += 1;
      yield step(m, graph, 'choose', [edge.source, edge.target], 'Accept edge', `${edge.source}-${edge.target} connects two separate components.`, 'Adding it cannot create a cycle, so it safely reduces the number of components.', 7);
    } else {
      graph.edges.find((e) => e.id === edge.id)!.rejected = true;
      yield step(m, graph, 'reject', [edge.source, edge.target], 'Reject cycle-forming edge', `${edge.source}-${edge.target} would connect nodes already in one component.`, 'MSTs never include cycles because a cycle always has a removable edge.', 9);
    }
    graph.edges.forEach((e) => { e.active = false; });
  }
  yield step({ ...m, steps: m.steps + 1 }, graph, 'complete', [], 'Minimum spanning tree complete', 'Selected edges connect all nodes with minimal total weight.', 'The cut property justifies each cheapest non-cycling choice.', 11);
}

function* prim(input: AlgorithmInput['graph']): Generator<AlgorithmStep> {
  const graph = cloneGraph(input);
  const visited = new Set([graph.nodes[0]?.id].filter(Boolean));
  const m = base();
  while (visited.size < graph.nodes.length) {
    const crossing = graph.edges
      .filter((e) => visited.has(e.source) !== visited.has(e.target))
      .sort((a, b) => a.weight - b.weight)[0];
    if (!crossing) break;
    m.steps += 1;
    m.comparisons += 1;
    crossing.active = true;
    yield step(m, graph, 'compare', [crossing.source, crossing.target], 'Find cheapest frontier edge', `Prim chooses ${crossing.source}-${crossing.target} with weight ${crossing.weight}.`, 'The tree expands through the least expensive edge crossing from visited to unvisited nodes.', 5);
    crossing.selected = true;
    visited.add(crossing.source);
    visited.add(crossing.target);
    m.steps += 1;
    yield step(m, graph, 'choose', [...visited], 'Grow the tree', `Added the edge and brought ${crossing.source}-${crossing.target} into the tree.`, 'The cheapest crossing edge is safe by the MST cut property.', 7);
    graph.edges.forEach((e) => { e.active = false; });
  }
  yield step({ ...m, steps: m.steps + 1 }, graph, 'complete', [...visited], 'Minimum spanning tree complete', 'Prim finished after every node joined the tree.', 'Each expansion preserved a single connected tree with the lowest available boundary cost.', 9);
}

export const graphAlgorithms: AlgorithmDefinition[] = [
  { id: 'kruskal', name: 'Kruskal MST', category: 'graph', complexity: { worst: 'O(E log E)', space: 'O(V)' }, code: ['sort edges by weight', 'for each edge', '  find endpoint components', '  if components differ', '    accept edge', '  else reject cycle'], createSteps: (input) => [...kruskal(input.graph)] },
  { id: 'prim', name: 'Prim MST', category: 'graph', complexity: { worst: 'O(E log V)', space: 'O(V)' }, code: ['start from any node', 'while nodes remain', '  inspect crossing edges', '  choose cheapest edge', '  add new node to tree', 'repeat'], createSteps: (input) => [...prim(input.graph)] },
];
