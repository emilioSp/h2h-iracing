export type ReferencePoint = {
  trackPct: number;
  timeElapsedSinceStart: number;
};

export type ReferenceLap = {
  refPoints: Map<number, ReferencePoint>;
  startTime: number;
  finishTime: number;
  lastTrackedPct: number;
  isCleanLap: boolean;
};

const RECENT_LAPS_WINDOW_SIZE = 4;

const activeLaps = new Map<number, ReferenceLap>();
const recentLaps = new Map<number, ReferenceLap[]>();

export const getActiveRefLap = (carIdx: number): ReferenceLap | null =>
  activeLaps.get(carIdx) ?? null;

export const setActiveRefLap = (carIdx: number, lap: ReferenceLap): void => {
  activeLaps.set(carIdx, lap);
};

export const addRecentLap = (carIdx: number, lap: ReferenceLap): void => {
  const window = recentLaps.get(carIdx) ?? [];
  window.push(lap);
  if (window.length > RECENT_LAPS_WINDOW_SIZE) window.shift();
  recentLaps.set(carIdx, window);
};

export const getRefLap = (carIdx: number): ReferenceLap | null => {
  const window = recentLaps.get(carIdx);
  if (!window || window.length === 0) return null;
  return window.reduce((best, lap) =>
    lap.finishTime - lap.startTime < best.finishTime - best.startTime
      ? lap
      : best,
  );
};

export const resetReferenceLaps = (): void => {
  activeLaps.clear();
  recentLaps.clear();
};
