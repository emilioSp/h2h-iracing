// Assembles driver, position, and lap data when the head-to-head overlay requests a car.
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import { computeBestLapTime } from '#service/best-lap-time.service.ts';
import { computeLastLapTime } from '#service/last-lap-time.service.ts';
import type { Standing } from '#service/standings.service.ts';

export type ComputeCarInput = {
  carIdx: number;
  standings: Standing[];
};

export const computeCar = async ({ carIdx, standings }: ComputeCarInput): Promise<Car> => {
  const carStanding = standings.find((s) => s.carIdx === carIdx);

  // biome-ignore lint/style/noNonNullAssertion: we assume the driver info is always available for valid carIdx
  const driver = driverRepository.getDriverInfo(carIdx)!;

  const lapsCompleted = await irsdkRepository.getLapsCompleted();

  return {
    driver,
    position: carStanding?.pos ?? 0,
    lastLapTime: await computeLastLapTime(carIdx),
    bestLapTime: await computeBestLapTime(carIdx),
    lap: lapsCompleted[carIdx] ?? sessionInfoRepository.getSessionLapsCompleted(carIdx) ?? 0,
  };
};
