// Stores lap repository state when telemetry is refreshed or queried.
export const LAP_TIME_SAMPLE_WINDOW = 5;

type LapTimeSample = {
  lapNumber: number;
  lapTime: number;
};

export type UpdateLapTimeTrackingInput = {
  carsIdx: number[];
  lapsCompleted: number[];
  lastLapTimes: number[];
};

export class LapRepository {
  private lapTimeSamples = new Map<number, LapTimeSample[]>();

  private prevLapCompleted: number[] = [];

  updateLapTimeTracking = ({
    carsIdx,
    lapsCompleted,
    lastLapTimes,
  }: UpdateLapTimeTrackingInput) => {
    for (const carIdx of carsIdx) {
      const lapCompleted = lapsCompleted[carIdx];
      const lapTime = lastLapTimes[carIdx];

      if (this.prevLapCompleted[carIdx] === lapCompleted) continue;

      if (!Number.isFinite(lapTime) || lapTime <= 0) continue;

      const samples = this.lapTimeSamples.get(carIdx) ?? [];
      samples.push({ lapNumber: lapCompleted, lapTime });

      if (samples.length > LAP_TIME_SAMPLE_WINDOW) {
        samples.shift();
      }

      this.lapTimeSamples.set(carIdx, samples);

      this.prevLapCompleted[carIdx] = lapCompleted;
    }
  };

  getMedianLapTime = (carIdx: number): number | null => {
    const samples = this.lapTimeSamples.get(carIdx);

    if (!samples || samples.length < 2) {
      return null;
    }

    const sorted = [...samples].sort((a, b) => a.lapTime - b.lapTime);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
      ? (sorted[mid - 1].lapTime + sorted[mid].lapTime) / 2
      : sorted[mid].lapTime;
  };

  resetLapTimeTracking = () => {
    this.lapTimeSamples = new Map();
    this.prevLapCompleted = [];
  };
}

export default new LapRepository();
