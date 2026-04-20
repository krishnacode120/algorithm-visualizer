import { backtrackingAlgorithms } from './backtracking';
import { graphAlgorithms } from './graph';
import { pathfindingAlgorithms } from './pathfinding';
import { sortingAlgorithms } from './sorting';

export const algorithms = [...sortingAlgorithms, ...pathfindingAlgorithms, ...graphAlgorithms, ...backtrackingAlgorithms];
export const getAlgorithm = (id: string) => algorithms.find((algorithm) => algorithm.id === id) ?? algorithms[0];
