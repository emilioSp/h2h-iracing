// Stores fuel repository state when telemetry is refreshed or queried.
export const FUEL_SAMPLE_WINDOW = 5;

export type FuelSample = {
  lapNumber: number;
  fuelAtLapStart: number;
};

export type UpdateFuelTrackingInput = {
  fuelLevel: number;
  playerLapCompleted: number;
};

export class FuelRepository {
  private fuelSamples: FuelSample[] = [];

  private prevPlayerLapCompleted = -1;

  updateFuelTracking = ({ fuelLevel, playerLapCompleted }: UpdateFuelTrackingInput): void => {
    if (playerLapCompleted === this.prevPlayerLapCompleted) return;

    this.prevPlayerLapCompleted = playerLapCompleted;

    this.fuelSamples.push({
      lapNumber: playerLapCompleted,
      fuelAtLapStart: fuelLevel,
    });

    if (this.fuelSamples.length > FUEL_SAMPLE_WINDOW) {
      this.fuelSamples.shift();
    }
  };

  getFuelSamples = (): readonly FuelSample[] => this.fuelSamples;

  resetFuelTracking = () => {
    this.fuelSamples = [];
    this.prevPlayerLapCompleted = -1;
  };

  getMedianFuelPerLap = (): number | null => {
    if (this.fuelSamples.length < 2) return null;

    const fuelDeltas: number[] = [];

    for (let i = 0; i < this.fuelSamples.length - 1; i++) {
      const delta = this.fuelSamples[i].fuelAtLapStart - this.fuelSamples[i + 1].fuelAtLapStart;

      if (delta > 0) fuelDeltas.push(delta);
    }

    if (fuelDeltas.length === 0) return null;

    const sorted = [...fuelDeltas].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };

  getLastLapFuelDelta = (): number | null => {
    if (this.fuelSamples.length < 2) {
      return null;
    }

    const prev = this.fuelSamples[this.fuelSamples.length - 2];
    const last = this.fuelSamples[this.fuelSamples.length - 1];
    const fuelLastLap = prev.fuelAtLapStart - last.fuelAtLapStart;

    return fuelLastLap <= 0 ? null : fuelLastLap;
  };
}

export default new FuelRepository();
