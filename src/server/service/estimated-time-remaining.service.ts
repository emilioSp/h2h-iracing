// Estimates race time remaining when computing fuel requirements.
import { isCheckeredFlag } from '#server/utils/is-checkered-flag.ts';

export type ComputeEstimatedTimeRemainingInput = {
  timeRemaining: number;
  flags: number;
  leaderMedianLapTime: number | null;
  playerMedianLapTime: number | null;
  leaderLapDistPct: number;
};

export const computeEstimatedTimeRemaining = ({
  timeRemaining,
  flags,
  leaderMedianLapTime,
  playerMedianLapTime,
  leaderLapDistPct,
}: ComputeEstimatedTimeRemainingInput): number | null => {
  if (isCheckeredFlag(flags)) return 0;

  if (playerMedianLapTime === null || leaderMedianLapTime === null) return null;

  const leaderTimeToFinishCurrentLap = (1 - leaderLapDistPct) * leaderMedianLapTime;

  // What will the official race clock read when the leader crosses the SF line?
  const leaderTimeRemainingAtNextSFCrossing = timeRemaining - leaderTimeToFinishCurrentLap;

  // Time left at the crossing adds complete laps plus the final white flag lap.
  const remainingLaps =
    leaderTimeRemainingAtNextSFCrossing >= 0
      ? Math.floor(leaderTimeRemainingAtNextSFCrossing / leaderMedianLapTime) + 1
      : 0;

  return leaderTimeToFinishCurrentLap + remainingLaps * leaderMedianLapTime;
};
