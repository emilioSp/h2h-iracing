import { getDriverInfo } from '#repository/driver.repository.ts';
import {
  getBestLapTime,
  getLapsCompleted,
  getLastLapTime,
} from '#repository/irsdk.repository.ts';
import {
  getSessionBestTime,
  getSessionLapsCompleted,
  getSessionLastLapTime,
} from '#repository/session-info.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Standing } from '#service/standings.service.ts';

export const computeLastLapTime = async (carIdx: number): Promise<number> => {
  const lastLapTime = await getLastLapTime(carIdx);
  if (lastLapTime > 0) return lastLapTime;

  const sessionLastLapTime = getSessionLastLapTime(carIdx);
  if (sessionLastLapTime > 0) return sessionLastLapTime;

  return NaN;
};

export const computeBestLapTime = async (carIdx: number): Promise<number> => {
  const bestLapTime = await getBestLapTime(carIdx);
  if (bestLapTime > 0) return bestLapTime;

  const sessionBestTime = getSessionBestTime(carIdx);
  if (sessionBestTime > 0) return sessionBestTime;

  return NaN;
};

export const computeCar = async (
  carIdx: number,
  standings: Standing[],
): Promise<Car> => {
  const carStanding = standings.find((s) => s.carIdx === carIdx);

  // biome-ignore lint/style/noNonNullAssertion: we assume the driver info is always available for valid carIdx
  const driver = getDriverInfo(carIdx)!;

  const lapsCompleted = await getLapsCompleted();

  return {
    driver,
    position: carStanding?.pos ?? 0,
    lastLapTime: await computeLastLapTime(carIdx),
    bestLapTime: await computeBestLapTime(carIdx),
    lap: lapsCompleted[carIdx] ?? getSessionLapsCompleted(carIdx) ?? 0,
  };
};
