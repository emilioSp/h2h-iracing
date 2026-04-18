export const FUEL_SAMPLE_WINDOW = 5;

export type FuelSample = {
  lapNumber: number;
  fuelAtLapStart: number;
};

let fuelSamples: FuelSample[] = [];
let prevPlayerLapCompleted = -1;

export const updateFuelTracking = (
  fuelLevel: number,
  playerLapCompleted: number,
): void => {
  if (playerLapCompleted === prevPlayerLapCompleted) return;

  prevPlayerLapCompleted = playerLapCompleted;

  fuelSamples.push({
    lapNumber: playerLapCompleted,
    fuelAtLapStart: fuelLevel,
  });

  if (fuelSamples.length > FUEL_SAMPLE_WINDOW) {
    fuelSamples.shift();
  }
};

export const getFuelSamples = (): readonly FuelSample[] => fuelSamples;

export const resetFuelTracking = () => {
  fuelSamples = [];
  prevPlayerLapCompleted = -1;
};

export const getMedianFuelPerLap = (): number | null => {
  if (fuelSamples.length < FUEL_SAMPLE_WINDOW) return null;

  const fuelDeltas: number[] = [];
  for (let i = 0; i < fuelSamples.length - 1; i++) {
    const delta =
      fuelSamples[i].fuelAtLapStart - fuelSamples[i + 1].fuelAtLapStart;
    if (delta > 0) fuelDeltas.push(delta);
  }

  if (fuelDeltas.length === 0) return null;

  const sorted = [...fuelDeltas].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const getLastLapFuelDelta = (): number | null => {
  if (fuelSamples.length < 2) {
    return null;
  }

  const prev = fuelSamples[fuelSamples.length - 2];
  const last = fuelSamples[fuelSamples.length - 1];
  const fuelLastLap = prev.fuelAtLapStart - last.fuelAtLapStart;
  return fuelLastLap <= 0 ? null : fuelLastLap;
};
