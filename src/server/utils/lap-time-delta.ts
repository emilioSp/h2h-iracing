// Compares two valid lap times when the head-to-head overlay displays a pace delta.
export type LapTimeDeltaInput = {
  playerLapTime: number;
  otherLapTime: number | undefined;
};

export const lapTimeDelta = ({ playerLapTime, otherLapTime }: LapTimeDeltaInput): number | null =>
  otherLapTime !== undefined && playerLapTime > 1 && otherLapTime > 1
    ? playerLapTime - otherLapTime
    : null;
