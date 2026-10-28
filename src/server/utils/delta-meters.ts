// Computes signed car separation when finding nearby cars.
import { wrapLapDelta } from '#server/utils/track-position.ts';

type GetDeltaMetersInput = {
  playerPct: number;
  otherDriverPct: number;
  trackLengthMeters: number;
};

export const getDeltaMeters = ({
  playerPct,
  otherDriverPct,
  trackLengthMeters,
}: GetDeltaMetersInput): number => wrapLapDelta(otherDriverPct - playerPct) * trackLengthMeters;
