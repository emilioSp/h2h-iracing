import { SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import type { DriverInfo } from '#schema/battle.schema.ts';
import { ir } from './irsdk.ts';

let driverMap = new Map<number, DriverInfo>();
let classEstLapTimeMap = new Map<number, number>();
let lastSessionTick = -1;

export const refreshTelemetry = () => {
  const tick: number = ir.get(VARS.SESSION_TICK)[0] ?? 0;
  if (tick === lastSessionTick && driverMap.size > 0) return;
  lastSessionTick = tick;

  const driverInfo = ir.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO);
  driverMap = new Map<number, DriverInfo>();
  classEstLapTimeMap = new Map<number, number>();

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

    if (
      driver.CarClassID !== undefined &&
      !classEstLapTimeMap.has(driver.CarClassID)
    ) {
      classEstLapTimeMap.set(
        driver.CarClassID,
        driver.CarClassEstLapTime ?? 90,
      );
    }
  }

  ir.refreshSharedMemory();
};

export const getPlayerCarIdx = (): number =>
  ir.get(VARS.PLAYER_CAR_IDX)[0] ?? -1;
export const getPositions = (): number[] => ir.get(VARS.CAR_IDX_POSITION) ?? [];
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
export const getDriverInfo = (carIdx: number): DriverInfo | null =>
  driverMap.get(carIdx) ?? null;

export const isConnected = (): boolean => ir.isConnected();
export const shutdown = (): void => ir.shutdown();
