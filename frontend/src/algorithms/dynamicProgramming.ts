import { AlgorithmDefinition, AlgorithmInput, AlgorithmStep, Metrics } from './types';

const base = (): Metrics => ({ steps: 0, comparisons: 0, swaps: 0, memory: 0 });

const dpStep = (
  metrics: Metrics,
  table: (number | string)[][],
  activeCells: string[],
  title: string,
  explanation: string,
  why: string,
  line: number,
  variables: Record<string, string | number>,
  invariant: string,
  prompt: string,
  rowLabels?: string[],
  colLabels?: string[],
): AlgorithmStep => ({
  id: metrics.steps,
  action: 'overwrite',
  title,
  explanation,
  why,
  line,
  variables,
  invariant,
  prompt,
  misconception: 'Dynamic programming is not just caching. The table design matters because each cell must represent a precise subproblem.',
  dp: {
    table: table.map((row) => [...row]),
    activeCells,
    rowLabels,
    colLabels,
    summary: invariant,
  },
  metrics: { ...metrics, memory: table.length * (table[0]?.length ?? 1) * 8 },
});

function* fibonacci(inputSize: number): Generator<AlgorithmStep> {
  const n = Math.max(1, Math.min(18, Math.floor(inputSize || 1)));
  const table: (number | string)[][] = [['i', 0], ['F(i)', 0]];
  const metrics = base();

  metrics.steps += 1;
  yield dpStep(metrics, table, ['1,1'], 'Initialize base case', 'F(0) is 0.', 'The recurrence needs base cases so later cells can depend on already-known answers.', 2, { i: 0, value: 0 }, 'After each step, every filled cell F(k) is correct for k <= i.', 'What value must exist before F(2) can be computed?');

  table[0].push(1);
  table[1].push(1);
  metrics.steps += 1;
  yield dpStep(metrics, table, ['1,2'], 'Initialize second base case', 'F(1) is 1.', 'Fibonacci depends on the two previous values, so both F(0) and F(1) must be available.', 3, { i: 1, value: 1 }, 'After each step, every filled cell F(k) is correct for k <= i.', 'Why is a simple left-to-right table enough here?');

  for (let i = 2; i <= n; i += 1) {
    metrics.steps += 1;
    metrics.comparisons += 1;
    const next = Number(table[1][i - 1]) + Number(table[1][i]);
    table[0].push(i);
    table[1].push(next);
    yield dpStep(metrics, table, ['1,' + (i + 1), '1,' + i, '1,' + (i - 1)], 'Reuse previous answers', `Computed F(${i}) = F(${i - 1}) + F(${i - 2}) = ${next}.`, 'The expensive recursive tree collapses into one table lookup per dependency.', 6, { i, previous: table[1][i], beforePrevious: table[1][i - 1], value: next }, 'Every new Fibonacci value is built only from two verified earlier values.', 'Predict the next cell before stepping forward.');
  }

  yield {
    ...dpStep({ ...metrics, steps: metrics.steps + 1 }, table, [], 'Fibonacci table complete', `F(${n}) is ${table[1].at(-1)}.`, 'The table has solved every smaller subproblem once, avoiding repeated recursion.', 8, { n, result: table[1].at(-1) ?? 0 }, 'The final answer is correct because all dependencies were already correct.', 'Can you name the recurrence and base cases?'),
    action: 'complete',
  };
}

function* knapsack(input: AlgorithmInput): Generator<AlgorithmStep> {
  const items = input.knapsackItems.slice(0, 8).map((item) => ({
    weight: Math.max(1, Math.floor(item.weight || 1)),
    value: Math.max(0, Math.floor(item.value || 0)),
  }));
  const capacity = Math.max(1, Math.min(20, Math.floor(input.knapsackCapacity || 1)));
  const table = Array.from({ length: items.length + 1 }, () => Array.from({ length: capacity + 1 }, () => 0));
  const rowLabels = ['0 items', ...items.map((item, index) => `#${index + 1} w${item.weight}/v${item.value}`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, col) => String(col));
  const metrics = base();

  for (let i = 1; i <= items.length; i += 1) {
    const item = items[i - 1];
    for (let cap = 0; cap <= capacity; cap += 1) {
      metrics.steps += 1;
      metrics.comparisons += 1;
      const withoutItem = table[i - 1][cap];
      const withItem = item.weight <= cap ? item.value + table[i - 1][cap - item.weight] : -Infinity;
      table[i][cap] = Math.max(withoutItem, withItem);
      yield dpStep(
        metrics,
        table,
        [`${i},${cap}`, `${i - 1},${cap}`, item.weight <= cap ? `${i - 1},${cap - item.weight}` : ''],
        'Choose best subproblem result',
        `At item ${i}, capacity ${cap}, best value is ${table[i][cap]}.`,
        item.weight <= cap ? 'The cell compares excluding the item with including it plus the best remaining capacity.' : 'The item is too heavy, so the only valid choice is to exclude it.',
        7,
        { item: i, capacity: cap, withoutItem, withItem: withItem === -Infinity ? 'too heavy' : withItem, best: table[i][cap] },
        'Each cell stores the best value using the first i items within capacity c.',
        'Will including the current item beat excluding it?',
        rowLabels,
        colLabels,
      );
    }
  }

  yield {
    ...dpStep({ ...metrics, steps: metrics.steps + 1 }, table, [], 'Knapsack table complete', `Best value at capacity ${capacity} is ${table[items.length][capacity]}.`, 'The final cell has considered every item and every smaller capacity needed by the recurrence.', 9, { capacity, result: table[items.length][capacity] }, 'The table bottom-right cell is optimal for all items and the target capacity.', 'Which earlier cells justify the final answer?', rowLabels, colLabels),
    action: 'complete',
  };
}

export const dynamicProgrammingAlgorithms: AlgorithmDefinition[] = [
  {
    id: 'fibonacci',
    name: 'Fibonacci DP',
    category: 'dynamic-programming',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    code: ['create table', 'F(0) = 0', 'F(1) = 1', 'for i from 2 to n', '  read F(i - 1)', '  read F(i - 2)', '  write F(i)', 'return F(n)'],
    createSteps: (input) => [...fibonacci(input.dpSize)],
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dynamic-programming',
    complexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)', space: 'O(nW)' },
    code: ['create item x capacity table', 'for each item i', '  for each capacity c', '    without = dp[i-1][c]', '    if item fits', '      with = value + dp[i-1][c-weight]', '    dp[i][c] = max(without, with)', 'return dp[n][W]'],
    createSteps: (input) => [...knapsack(input)],
  },
];
