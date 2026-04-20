import { AlgorithmDefinition, AlgorithmInput, AlgorithmStep, Metrics } from './types';

const baseMetrics = (): Metrics => ({ steps: 0, comparisons: 0, swaps: 0, memory: 0 });

const makeStep = (
  metrics: Metrics,
  action: AlgorithmStep['action'],
  array: number[],
  activeIndices: number[],
  sortedIndices: number[],
  title: string,
  explanation: string,
  why: string,
  line: number,
): AlgorithmStep => ({
  id: metrics.steps,
  action,
  array: [...array],
  activeIndices,
  sortedIndices,
  title,
  explanation,
  why,
  line,
  metrics: { ...metrics, memory: Math.round(array.length * 8 + sortedIndices.length * 4) },
});

function* bubbleSort(input: number[]): Generator<AlgorithmStep> {
  const a = [...input];
  const sorted = new Set<number>();
  const m = baseMetrics();
  if (a.length === 0) {
    yield makeStep(m, 'complete', a, [], [], 'Empty array', 'There is nothing to sort.', 'Bubble Sort needs adjacent values to compare, and this input has none.', 1);
    return;
  }
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < a.length - i - 1; j += 1) {
      m.steps += 1;
      m.comparisons += 1;
      yield makeStep(m, 'compare', a, [j, j + 1], [...sorted], 'Compare adjacent values', `Comparing ${a[j]} and ${a[j + 1]}.`, 'Bubble Sort repeatedly compares neighbors because a larger left value must move right.', 3);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        m.steps += 1;
        m.swaps += 1;
        yield makeStep(m, 'swap', a, [j, j + 1], [...sorted], 'Swap out-of-order pair', `Swapped ${a[j + 1]} with ${a[j]}.`, 'The larger value bubbles one position toward its final sorted location.', 5);
      }
    }
    sorted.add(a.length - i - 1);
  }
  yield makeStep({ ...m, steps: m.steps + 1 }, 'complete', a, [], a.map((_, i) => i), 'Array sorted', 'Every pass placed one maximum value at the right edge.', 'No adjacent inversions remain, so the full array is sorted.', 8);
}

function* mergeSort(input: number[]): Generator<AlgorithmStep> {
  const a = [...input];
  const m = baseMetrics();
  function* sort(left: number, right: number): Generator<AlgorithmStep> {
    if (right - left <= 1) return;
    const mid = Math.floor((left + right) / 2);
    yield* sort(left, mid);
    yield* sort(mid, right);
    const temp: number[] = [];
    let i = left;
    let j = mid;
    while (i < mid && j < right) {
      m.steps += 1;
      m.comparisons += 1;
      yield makeStep(m, 'compare', a, [i, j], [], 'Compare merge fronts', `Comparing ${a[i]} from the left half with ${a[j]} from the right half.`, 'Merge Sort can choose the next output by looking only at the first unmerged item in each sorted half.', 6);
      temp.push(a[i] <= a[j] ? a[i++] : a[j++]);
    }
    while (i < mid) temp.push(a[i++]);
    while (j < right) temp.push(a[j++]);
    for (let k = 0; k < temp.length; k += 1) {
      a[left + k] = temp[k];
      m.steps += 1;
      yield makeStep(m, 'overwrite', a, [left + k], [], 'Write merged value', `Placed ${temp[k]} into position ${left + k}.`, 'The merged segment is rebuilt in sorted order from the smallest remaining choices.', 10);
    }
  }
  yield* sort(0, a.length);
  yield makeStep({ ...m, steps: m.steps + 1 }, 'complete', a, [], a.map((_, i) => i), 'Array sorted', 'All divided segments have been merged back together.', 'Merging sorted halves preserves order and eventually covers the whole array.', 12);
}

function* quickSort(input: number[]): Generator<AlgorithmStep> {
  const a = [...input];
  const m = baseMetrics();
  function* partition(low: number, high: number): Generator<AlgorithmStep, number, unknown> {
    const pivot = a[high];
    let i = low;
    m.steps += 1;
    yield makeStep(m, 'partition', a, [high], [], 'Choose pivot', `Using ${pivot} as the pivot.`, 'Quick Sort partitions around a pivot so smaller values go left and larger values go right.', 3);
    for (let j = low; j < high; j += 1) {
      m.steps += 1;
      m.comparisons += 1;
      yield makeStep(m, 'compare', a, [j, high], [], 'Compare with pivot', `Checking whether ${a[j]} belongs before pivot ${pivot}.`, 'Values less than the pivot are collected into the left partition.', 5);
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        m.steps += 1;
        m.swaps += 1;
        yield makeStep(m, 'swap', a, [i, j], [], 'Move below pivot', `${a[i]} moved into the lower partition.`, 'This keeps positions before the scan index reserved for values smaller than the pivot.', 7);
        i += 1;
      }
    }
    [a[i], a[high]] = [a[high], a[i]];
    m.steps += 1;
    m.swaps += 1;
    yield makeStep(m, 'swap', a, [i, high], [i], 'Place pivot', `Pivot ${a[i]} moved to its final index ${i}.`, 'After partitioning, every left value is smaller and every right value is greater or equal.', 10);
    return i;
  }
  function* sort(low: number, high: number): Generator<AlgorithmStep, void, unknown> {
    if (low >= high) return;
    const p = yield* partition(low, high);
    yield* sort(low, p - 1);
    yield* sort(p + 1, high);
  }
  yield* sort(0, a.length - 1);
  yield makeStep({ ...m, steps: m.steps + 1 }, 'complete', a, [], a.map((_, i) => i), 'Array sorted', 'Every pivot has been placed between smaller and larger partitions.', 'Recursively partitioning leaves each value in its final sorted position.', 13);
}

function* heapSort(input: number[]): Generator<AlgorithmStep> {
  const a = [...input];
  const m = baseMetrics();
  function* heapify(n: number, i: number): Generator<AlgorithmStep> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    for (const child of [left, right]) {
      if (child < n) {
        m.steps += 1;
        m.comparisons += 1;
        yield makeStep(m, 'compare', a, [largest, child], [], 'Compare heap parent and child', `Checking whether ${a[child]} should rise above ${a[largest]}.`, 'A max heap keeps every parent at least as large as its children.', 5);
        if (a[child] > a[largest]) largest = child;
      }
    }
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      m.steps += 1;
      m.swaps += 1;
      yield makeStep(m, 'swap', a, [i, largest], [], 'Restore heap order', `Moved ${a[i]} above ${a[largest]}.`, 'The largest local value must become the parent to maintain the heap invariant.', 9);
      yield* heapify(n, largest);
    }
  }
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i -= 1) yield* heapify(a.length, i);
  const sorted = new Set<number>();
  for (let end = a.length - 1; end > 0; end -= 1) {
    [a[0], a[end]] = [a[end], a[0]];
    sorted.add(end);
    m.steps += 1;
    m.swaps += 1;
    yield makeStep(m, 'swap', a, [0, end], [...sorted], 'Extract maximum', `${a[end]} moved to sorted position ${end}.`, 'The heap root is the largest remaining value, so it belongs at the end.', 14);
    yield* heapify(end, 0);
  }
  yield makeStep({ ...m, steps: m.steps + 1 }, 'complete', a, [], a.map((_, i) => i), 'Array sorted', 'The max heap has been repeatedly drained from largest to smallest.', 'Each extraction fixes one final position without needing extra arrays.', 17);
}

export const sortingAlgorithms: AlgorithmDefinition[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    complexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' },
    code: ['for each pass', '  for each adjacent pair', '    compare left and right', '    if left > right', '      swap them', '  mark final item sorted'],
    createSteps: (input: AlgorithmInput) => [...bubbleSort(input.array)],
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    code: ['split range in half', 'sort left half', 'sort right half', 'while both halves have items', '  compare front values', '  append smaller front', 'copy merged values back'],
    createSteps: (input) => [...mergeSort(input.array)],
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)' },
    code: ['choose pivot', 'scan partition range', 'compare item with pivot', 'if item < pivot', '  swap into lower partition', 'place pivot between partitions', 'recurse left and right'],
    createSteps: (input) => [...quickSort(input.array)],
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    code: ['build max heap', 'compare parent with children', 'swap largest child upward', 'repeat until heap valid', 'swap root with last unsorted', 'shrink heap', 'heapify root again'],
    createSteps: (input) => [...heapSort(input.array)],
  },
];
