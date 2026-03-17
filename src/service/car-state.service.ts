import type { CarState, DriverInfo } from '#schema/battle.schema.ts';
import { getDriverInfo } from '../repository/telemetry.repository.ts';

export const buildCarState = (
  carIdx: number,
  position: number,
  lastLapTimes: number[],
  bestLapTimes: number[],
  laps: number[],
): (CarState & { driver: DriverInfo }) | null => {
  const driver = getDriverInfo(carIdx);
  if (!driver) return null;

  return {
    driver,
    position,
    lastLapTime: (lastLapTimes[carIdx] ?? 0) > 0 ? lastLapTimes[carIdx] : NaN,
    bestLapTime: (bestLapTimes[carIdx] ?? 0) > 0 ? bestLapTimes[carIdx] : NaN,
    lap: laps[carIdx] ?? 0,
  };
};