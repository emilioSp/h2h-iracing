import type { ReferenceLap } from '#utils/pchip.ts';

export type { ReferenceLap, ReferencePoint } from '#utils/pchip.ts';

const activeLaps = new Map<number, ReferenceLap>();
const bestLaps = new Map<number, ReferenceLap>();

export const getActiveRefLap = (carIdx: number): ReferenceLap | null =>
  activeLaps.get(carIdx) ?? null;

export const setActiveRefLap = (carIdx: number, lap: ReferenceLap): void => {
  activeLaps.set(carIdx, lap);
};

export const getBestRefLap = (carIdx: number): ReferenceLap | null =>
  bestLaps.get(carIdx) ?? null;

export const setBestRefLap = (carIdx: number, lap: ReferenceLap): void => {
  bestLaps.set(carIdx, lap);
};

export const resetReferenceLaps = (): void => {
  activeLaps.clear();
  bestLaps.clear();
};
