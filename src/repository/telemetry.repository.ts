import { SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import config from '#config';
import type { Driver } from '#schema/battle.schema.ts';
import { ir } from './irsdk.ts';

// TODO: questo modulo deve essere splittato in 2
/*
1. i metodi che interagiscono con IRSDK, devono essere spostati in irsdk.repository.ts
2. i metodi che gestiscono le driverInfo devono essere spostati in driver.service.ts
 */

export const refreshTelemetry = () => ir.refreshSharedMemory();

let driverMap = new Map<number, Driver>();
export const refreshDriverInfo = () => {
  const driverInfo = ir.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO);
  driverMap = new Map<number, Driver>();

  for (const driver of driverInfo.Drivers) {
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
  ir
    .getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO)
    .Drivers.filter(
      (d) => d.CarIdx >= 0 && d.UserName.toLowerCase() !== 'pace car',
    )
    .map((d) => d.CarIdx);

export const getPlayerCarIdx = (): number =>
  config.DATA_MODE === 'mock' ? 4 : (ir.get(VARS.PLAYER_CAR_IDX)[0] ?? -1);
export const getLastLapTimes = (): number[] =>
  ir.get(VARS.CAR_IDX_LAST_LAP_TIME) ?? [];
export const getBestLapTimes = (): number[] =>
  ir.get(VARS.CAR_IDX_BEST_LAP_TIME) ?? [];
export const getLaps = (): number[] => ir.get(VARS.CAR_IDX_LAP) ?? [];
export const getSessionTime = (): number => ir.get(VARS.SESSION_TIME)[0] ?? 0;
export const getLapDistPct = (): number[] =>
  ir.get(VARS.CAR_IDX_LAP_DIST_PCT) ?? [];
export const getOnPitRoad = (): number[] =>
  ir.get(VARS.CAR_IDX_ON_PIT_ROAD) ?? [];

export const isConnected = (): boolean => ir.isConnected();
export const shutdown = (): void => ir.shutdown();
