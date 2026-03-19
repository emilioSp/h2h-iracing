import type { Driver } from '#schema/battle.schema.ts';
import { getRawDrivers } from '../repository/irsdk.repository.ts';

let driverMap = new Map<number, Driver>();

export const refreshDriverInfo = () => {
  driverMap = new Map<number, Driver>();

  for (const driver of getRawDrivers()) {
    if (driver.CarIdx !== undefined) {
      driverMap.set(driver.CarIdx, {
        carIdx: driver.CarIdx,
        name: String(driver.UserName ?? ''),
        carNumber: String(driver.CarNumber ?? ''),
        car: String(driver.CarScreenName ?? ''),
        iRating: Number(driver.IRating ?? 0),
        license: String(driver.LicString ?? ''),
      });
    }
  }

  return driverMap;
};

export const getDriverInfo = (carIdx: number): Driver | null =>
  driverMap.get(carIdx) ?? null;

export const getCarIdxs = (): number[] =>
  getRawDrivers()
    .filter((d) => d.CarIdx >= 0 && d.UserName.toLowerCase() !== 'pace car')
    .map((d) => d.CarIdx);
