import { IRSDK, SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import config from '#config';

let ir: IRSDK | null = null;

export const connectToIRacing = async (): Promise<IRSDK | null> => {
  if (ir?.isConnected()) {
    return ir;
  }

  try {
    ir =
      config.DATA_MODE === 'mock'
        ? IRSDK.fromDump(config.DUMP_FILE_PATH)
        : await IRSDK.connect();
  } catch (e) {
    console.warn('iRacing not available at the moment.', e);
    ir = null;
  }

  return ir;
};

export const refreshTelemetry = () => ir?.refreshSharedMemory();
export const isIRacingConnected = (): boolean => ir?.isConnected() ?? false;
export const shutdown = (): void => ir?.shutdown();

export const getPlayerCarIdx = (): number =>
  ir?.get(VARS.PLAYER_CAR_IDX)[0] ?? -1;

export const getLastLapTime = (carIdx: number): number => {
  const lapTime = ir?.get(VARS.CAR_IDX_LAST_LAP_TIME)[carIdx];
  return lapTime > 0 ? lapTime : NaN;
};

export const getBestLapTime = (carIdx: number): number => {
  const bestLapTime = ir?.get(VARS.CAR_IDX_BEST_LAP_TIME)[carIdx];
  return bestLapTime > 0 ? bestLapTime : NaN;
};

export const getLaps = (): number[] => ir?.get(VARS.CAR_IDX_LAP) ?? [];
export const getSessionTime = (): number => ir?.get(VARS.SESSION_TIME)[0] ?? 0;
export const getLapDistPct = (): number[] =>
  ir?.get(VARS.CAR_IDX_LAP_DIST_PCT) ?? [];
export const getOnPitRoad = (): number[] =>
  ir?.get(VARS.CAR_IDX_ON_PIT_ROAD) ?? [];
export const getTrackSurfaces = (): number[] =>
  ir?.get(VARS.CAR_IDX_TRACK_SURFACE) ?? [];
export const getEstTime = (): number[] => ir?.get(VARS.CAR_IDX_EST_TIME) ?? [];
export const getRawDrivers = () =>
  ir?.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO).Drivers ?? [];
