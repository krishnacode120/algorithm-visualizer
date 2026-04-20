import { backtrackingAlgorithms } from './backtracking';
import { dynamicProgrammingAlgorithms } from './dynamicProgramming';
import { graphAlgorithms } from './graph';
import { pathfindingAlgorithms } from './pathfinding';
import { sortingAlgorithms } from './sorting';

export const algorithms = [...sortingAlgorithms, ...pathfindingAlgorithms, ...graphAlgorithms, ...backtrackingAlgorithms, ...dynamicProgrammingAlgorithms];
export const getAlgorithm = (id: string) => algorithms.find((algorithm) => algorithm.id === id) ?? algorithms[0];
