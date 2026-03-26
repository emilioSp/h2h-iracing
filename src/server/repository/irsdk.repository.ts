import { IRSDK, SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import config from '#config';

const connectToIRacing = async (): Promise<IRSDK> => {
  const ir =
    config.DATA_MODE === 'mock'
      ? IRSDK.fromDump(config.DUMP_FILE_PATH)
      : await IRSDK.connect();

  return ir;
};

export const ir = await connectToIRacing();

export const refreshTelemetry = () => ir.refreshSharedMemory();
export const isConnected = (): boolean => ir.isConnected();
export const shutdown = (): void => ir.shutdown();

export const getPlayerCarIdx = (): number =>
  ir.get(VARS.PLAYER_CAR_IDX)[0] ?? -1;
export const getLastLapTime = (carIdx: number): number =>
  ir.get(VARS.CAR_IDX_LAST_LAP_TIME)[carIdx] > 0
    ? ir.get(VARS.CAR_IDX_LAST_LAP_TIME)[carIdx]
    : NaN;
export const getBestLapTime = (carIdx: number): number =>
  ir.get(VARS.CAR_IDX_BEST_LAP_TIME)[carIdx] > 0
    ? ir.get(VARS.CAR_IDX_BEST_LAP_TIME)[carIdx]
    : NaN;
export const getLaps = (): number[] => ir.get(VARS.CAR_IDX_LAP) ?? [];
export const getSessionTime = (): number => ir.get(VARS.SESSION_TIME)[0] ?? 0;
export const getLapDistPct = (): number[] =>
  ir.get(VARS.CAR_IDX_LAP_DIST_PCT) ?? [];
export const getOnPitRoad = (): number[] =>
  ir.get(VARS.CAR_IDX_ON_PIT_ROAD) ?? [];
export const getTrackSurfaces = (): number[] =>
  ir.get(VARS.CAR_IDX_TRACK_SURFACE) ?? [];
export const getEstTime = (): number[] => ir.get(VARS.CAR_IDX_EST_TIME) ?? [];
export const getRawDrivers = () =>
  ir.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO).Drivers;
