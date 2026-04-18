import { getCarsIdx } from '#repository/driver.repository.ts';

export const LAP_TIME_SAMPLE_WINDOW = 5;

type LapTimeSample = {
  lapNumber: number;
  lapTime: number;
};

let lapTimeSamples = new Map<number, LapTimeSample[]>();
let prevLapCompleted: number[] = [];

export const updateLapTimeTracking = async (
  lapsCompleted: number[],
  lastLapTimes: number[],
) => {
  const carsIdx = await getCarsIdx();
  for (const carIdx of carsIdx) {
    const lapCompleted = lapsCompleted[carIdx];
    const lapTime = lastLapTimes[carIdx];

    if (prevLapCompleted[carIdx] === lapCompleted) continue;
    if (!Number.isFinite(lapTime) || lapTime <= 0) continue;

    const samples = lapTimeSamples.get(carIdx) ?? [];
    samples.push({ lapNumber: lapCompleted, lapTime });

    if (samples.length > LAP_TIME_SAMPLE_WINDOW) {
      samples.shift();
    }
    lapTimeSamples.set(carIdx, samples);

    prevLapCompleted[carIdx] = lapCompleted;
  }
};

export const getMedianLapTime = (carIdx: number): number | null => {
  const samples = lapTimeSamples.get(carIdx);

  if (!samples || samples.length < 2) {
    return null;
  }

  const sorted = [...samples].sort((a, b) => a.lapTime - b.lapTime);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1].lapTime + sorted[mid].lapTime) / 2
    : sorted[mid].lapTime;
};

export const getLapTimeSamples = (): ReadonlyMap<
  number,
  readonly { lapNumber: number; lapTime: number }[]
> => lapTimeSamples;

export const resetLapTimeTracking = () => {
  lapTimeSamples = new Map();
  prevLapCompleted = [];
};
