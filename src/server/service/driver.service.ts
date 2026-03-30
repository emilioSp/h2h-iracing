import {
  getPlayerCarIdx,
  getRawDrivers,
} from '#repository/irsdk.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';

let driverMap = new Map<number, Driver>();

export const getFilteredRawDrivers = async () => {
  const playerCarIdx = await getPlayerCarIdx();

  const rawDrivers = await getRawDrivers();
  const player = rawDrivers.find((d: any) => d.CarIdx === playerCarIdx);
  if (!player) return [];

  // TODO: fix any type
  return rawDrivers.filter(
    (d: any) =>
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

export const getCarIdxs = async (): Promise<number[]> =>
  (await getFilteredRawDrivers()).map((d: any) => d.CarIdx);
