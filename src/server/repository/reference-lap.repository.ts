// Stores reference lap repository state when telemetry is refreshed or queried.
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

export type SetActiveRefLapInput = {
  carIdx: number;
  lap: ReferenceLap;
};

export type AddRecentLapInput = {
  carIdx: number;
  lap: ReferenceLap;
};

export class ReferenceLapRepository {
  private activeLaps = new Map<number, ReferenceLap>();

  private recentLaps = new Map<number, ReferenceLap[]>();

  getActiveRefLap = (carIdx: number): ReferenceLap | null => this.activeLaps.get(carIdx) ?? null;

  setActiveRefLap = ({ carIdx, lap }: SetActiveRefLapInput): void => {
    this.activeLaps.set(carIdx, lap);
  };

  addRecentLap = ({ carIdx, lap }: AddRecentLapInput): void => {
    const rollingWindow = this.recentLaps.get(carIdx) ?? [];
    rollingWindow.push(lap);

    if (rollingWindow.length > ROLLING_WINDOW_LAPS_SIZE) rollingWindow.shift();
    this.recentLaps.set(carIdx, rollingWindow);
  };

  getRefLap = (carIdx: number): ReferenceLap | null => {
    const rollingWindow = this.recentLaps.get(carIdx);

    if (!rollingWindow || rollingWindow.length === 0) return null;

    const bestLapRef = rollingWindow.reduce((lapA, lapB) =>
      lapA.finishTime - lapA.startTime < lapB.finishTime - lapB.startTime ? lapA : lapB,
    );

    return bestLapRef;
  };

  resetReferenceLaps = (): void => {
    this.activeLaps.clear();
    this.recentLaps.clear();
  };
}

export default new ReferenceLapRepository();
