// Computes fractional distance remaining when estimating fuel to the finish.

export type ComputeLapsRemainingInput = {
  estimatedTimeRemaining: number | null;
  playerMedianLapTime: number | null;
  playerLapDistPct: number;
};

export const computeLapsRemaining = ({
  estimatedTimeRemaining,
  playerMedianLapTime,
  playerLapDistPct,
}: ComputeLapsRemainingInput): number | null => {
  // Let lapDistance = estimatedTimeRemaining / playerMedianLapTime
  // Correct lapsRemaining = ceil(playerLapDistPct + lapDistance) - playerLapDistPct
  // LapsRemaining is intentionally fractional: it's the lap-distance the player still has to cover, used directly by the fuel calculation.
  if (estimatedTimeRemaining === null || playerMedianLapTime === null) {
    return null;
  }

  const projectedTotalLaps = playerLapDistPct + estimatedTimeRemaining / playerMedianLapTime;

  // Round to the 8th decimal digit to remove precision error
  const finalLap = Math.ceil(projectedTotalLaps - 1e-8);

  return finalLap - playerLapDistPct;
};
