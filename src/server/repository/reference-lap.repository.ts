export type ReferencePoint = {
  trackPct: number;
  timeElapsedSinceStart: number;
};

export type ReferenceLap = {
  refPoints: Map<number, ReferencePoint>;
  startTime: number;
  finishTime: number;
  lastTrackedPct: number;
  isOnPitRoad: boolean;
};

export const ROLLING_WINDOW_LAPS_SIZE = 5;

const activeLaps = new Map<number, ReferenceLap>();
const recentLaps = new Map<number, ReferenceLap[]>();

export const getActiveRefLap = (carIdx: number): ReferenceLap | null =>
  activeLaps.get(carIdx) ?? null;

export const setActiveRefLap = (carIdx: number, lap: ReferenceLap): void => {
  activeLaps.set(carIdx, lap);
};

export const addRecentLap = (carIdx: number, lap: ReferenceLap): void => {
  const rollingWindow = recentLaps.get(carIdx) ?? [];
  rollingWindow.push(lap);
  if (rollingWindow.length > ROLLING_WINDOW_LAPS_SIZE) rollingWindow.shift();
  recentLaps.set(carIdx, rollingWindow);
};

export const getRefLap = (carIdx: number): ReferenceLap | null => {
  const rollingWindow = recentLaps.get(carIdx);
  if (!rollingWindow || rollingWindow.length === 0) return null;
  const bestLapRef = rollingWindow.reduce((lapA, lapB) =>
    lapA.finishTime - lapA.startTime < lapB.finishTime - lapB.startTime
      ? lapA
      : lapB,
  );

  return bestLapRef;
};

export const resetReferenceLaps = (): void => {
  activeLaps.clear();
  recentLaps.clear();
};
