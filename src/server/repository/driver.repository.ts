import {
  getPlayerCarIdx,
  getRawDrivers,
} from '#repository/irsdk.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';

let driverMap = new Map<number, Driver>();

export const getFilteredRawDrivers = async () => {
  const playerCarIdx = await getPlayerCarIdx();

  const rawDrivers = await getRawDrivers();
  const player = rawDrivers.find((d) => d.CarIdx === playerCarIdx);
  if (!player) return [];

  return rawDrivers.filter(
    (d) =>
      d.CarIdx > -1 && d.CarClassID === player.CarClassID && !d.CarIsPaceCar,
  );
};

export const refreshDriverInfo = async () => {
  driverMap = new Map<number, Driver>();

  for (const driver of await getFilteredRawDrivers()) {
    driverMap.set(driver.CarIdx, {
      carIdx: driver.CarIdx,
      name: driver.UserName,
      carNumber: driver.CarNumber,
      car: driver.CarScreenNameShort,
      iRating:
        process.env.DATA_MODE === 'mock' ? 3000 : Number(driver.IRating ?? 0),
      license: String(driver.LicString ?? ''),
      classEstLapTime: driver.CarClassEstLapTime,
    });
  }

  return driverMap;
};

export const getDriverInfo = (carIdx: number): Driver | null =>
  driverMap.get(carIdx) ?? null;

export const getClassEstLapTime = (carIdx: number): number =>
  driverMap.get(carIdx)?.classEstLapTime ?? 0;

export const getPlayerClassCarIdx = async (): Promise<number[]> =>
  (await getFilteredRawDrivers()).map((d) => d.CarIdx);

export const getCarsIdx = async (): Promise<number[]> => {
  const rawDrivers = await getRawDrivers();
  return rawDrivers
    .filter((d) => d.CarIdx > -1 && !d.CarIsPaceCar)
    .map((d) => d.CarIdx);
};
