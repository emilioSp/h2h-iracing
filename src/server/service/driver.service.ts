import {
  getPlayerCarIdx,
  getRawDrivers,
} from '#repository/irsdk.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';

let driverMap = new Map<number, Driver>();

export const getFilteredRawDrivers = () => {
  const playerCarIdx = getPlayerCarIdx();

  const rawDrivers = getRawDrivers();
  const playerCarClassID = rawDrivers.find(
    (d) => d.CarIdx === playerCarIdx,
  )!.CarClassID;

  return rawDrivers.filter(
    (d) => d.CarIdx > 0 && d.CarClassID === playerCarClassID && !d.CarIsPaceCar,
  );
};

export const refreshDriverInfo = () => {
  driverMap = new Map<number, Driver>();

  for (const driver of getFilteredRawDrivers()) {
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

export const getCarIdxs = (): number[] =>
  getFilteredRawDrivers().map((d) => d.CarIdx);
