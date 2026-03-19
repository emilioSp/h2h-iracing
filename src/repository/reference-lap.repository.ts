import type { ReferenceLap } from '../utils/pchip.ts';

export type { ReferenceLap, ReferencePoint } from '../utils/pchip.ts';

const activeLaps = new Map<number, ReferenceLap>();
const bestLaps = new Map<number, ReferenceLap>();

export const getActiveLap = (carIdx: number): ReferenceLap | null =>
  activeLaps.get(carIdx) ?? null;

export const setActiveLap = (carIdx: number, lap: ReferenceLap): void => {
  activeLaps.set(carIdx, lap);
};

export const getBestLap = (carIdx: number): ReferenceLap | null =>
  bestLaps.get(carIdx) ?? null;

export const setBestLap = (carIdx: number, lap: ReferenceLap): void => {
  bestLaps.set(carIdx, lap);
};

export const resetReferenceLaps = (): void => {
  activeLaps.clear();
  bestLaps.clear();
};
