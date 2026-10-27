// Snaps track positions to reference buckets when recording or interpolating lap points.
const DECIMAL_PLACES = 8;

export type NormalizeTrackPctInput = {
  trackPct: number;
  referenceInterval: number;
};

export const normalizeTrackPct = ({
  trackPct,
  referenceInterval,
}: NormalizeTrackPctInput): number => {
  const normalizedTrackPct = Number.parseFloat(
    (trackPct - (trackPct % referenceInterval)).toFixed(DECIMAL_PLACES),
  );

  return normalizedTrackPct < 0 || normalizedTrackPct >= 1 ? 0 : normalizedTrackPct;
};
