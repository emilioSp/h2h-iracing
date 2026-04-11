import { IRSDK, SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import config from '#config';
import { debug } from '../debug.ts';

let ir: IRSDK | null = null;

const connectToIRacing = async (): Promise<void> => {
  if (ir?.isConnected()) {
    return;
  }

  try {
    ir =
      config.DATA_MODE === 'mock'
        ? IRSDK.fromDump(config.DUMP_FILE_PATH)
        : await IRSDK.connect();
  } catch (e) {
    debug('iRacing not available at the moment', e);
    ir = null;
  }
};

const withConnect = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
): ((...args: TArgs) => Promise<TReturn>) => {
  return async (...args: TArgs) => {
    await connectToIRacing();
    return fn(...args);
  };
};

export const refreshTelemetry = withConnect(() => ir?.refreshSharedMemory());

export const isIRacingConnected = withConnect(
  (): boolean => ir?.isConnected() ?? false,
);

export const shutdown = withConnect((): void => ir?.shutdown());

export const getPlayerCarIdx = withConnect(
  (): number => ir?.get(VARS.PLAYER_CAR_IDX)[0] ?? -1,
);

export const getLastLapTime = withConnect((carIdx: number): number => {
  const lapTime = ir?.get(VARS.CAR_IDX_LAST_LAP_TIME)[carIdx];
  return lapTime > 0 ? lapTime : NaN;
});

export const getBestLapTime = withConnect((carIdx: number): number => {
  const bestLapTime = ir?.get(VARS.CAR_IDX_BEST_LAP_TIME)[carIdx];
  return bestLapTime > 0 ? bestLapTime : NaN;
});

export const getLapsCompleted = withConnect(
  (): number[] => ir?.get(VARS.CAR_IDX_LAP_COMPLETED) ?? [],
);

export const getSessionTime = withConnect(
  (): number => ir?.get(VARS.SESSION_TIME)[0] ?? 0,
);

export const getLapDistPct = withConnect(
  (): number[] => ir?.get(VARS.CAR_IDX_LAP_DIST_PCT) ?? [],
);

export const getOnPitRoad = withConnect(
  (): number[] => ir?.get(VARS.CAR_IDX_ON_PIT_ROAD) ?? [],
);

export const getEstTime = withConnect(
  (): number[] => ir?.get(VARS.CAR_IDX_EST_TIME) ?? [],
);

export const getSessionNum = withConnect(
  (): number => ir?.get(VARS.SESSION_NUM)[0] ?? -1,
);

export const getRawDrivers = withConnect(
  () => ir?.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO).Drivers ?? [],
);

export const getClassPositions = withConnect(
  (): number[] => ir?.get(VARS.CAR_IDX_CLASS_POSITION) ?? [],
);

export const getSessionType = withConnect((): string => {
  const sessionNum = ir?.get(VARS.SESSION_NUM)[0] ?? -1;
  const sessionInfo = ir?.getSessionInfo(SESSION_DATA_KEYS.SESSION_INFO);
  const session = sessionInfo?.Sessions?.find(
    (s) => s.SessionNum === sessionNum,
  );
  if (!session) {
    throw new Error(`No session found for SessionNum ${sessionNum}`);
  }
  return session.SessionType;
});

export const getTrackLengthMeters = withConnect((): number => {
  const weekendInfo = ir?.getSessionInfo(SESSION_DATA_KEYS.WEEKEND_INFO);
  if (!weekendInfo) {
    return 0;
  }
  return Number.parseFloat(weekendInfo.TrackLength) * 1000;
});

const TRACK_WETNESS_LABELS = [
  'Unknown',
  'Dry',
  'Mostly Dry',
  'Very Lightly Wet',
  'Lightly Wet',
  'Moderately Wet',
  'Very Wet',
  'Extremely Wet',
] as const;

export const getAirTemperature = withConnect(
  (): number => ir?.get(VARS.AIR_TEMP)[0] ?? 0,
);

export const getRelativeHumidity = withConnect(
  (): number => ir?.get(VARS.RELATIVE_HUMIDITY)[0] ?? 0,
);

export const getTrackTemperature = withConnect(
  (): number => ir?.get(VARS.TRACK_TEMP_CREW)[0] ?? 0,
);

export const getTrackWetness = withConnect((): string => {
  const raw = ir?.get(VARS.TRACK_WETNESS)[0] ?? 0;
  return TRACK_WETNESS_LABELS[raw] ?? 'Unknown';
});

export const getPrecipitation = withConnect(
  (): number => ir?.get(VARS.PRECIPITATION)[0] ?? 0,
);

export const getWindDirection = withConnect(
  (): number => ir?.get(VARS.WIND_DIR)[0] ?? 0,
);

export const getYawNorthDirection = withConnect(
  () => ir?.get(VARS.YAW_NORTH)[0] ?? 0,
);

export const getWindVelocity = withConnect(
  (): number => ir?.get(VARS.WIND_VEL)[0] ?? 0,
);

export const getSessionSecondsAfterMidnight = withConnect(
  (): number => ir?.get(VARS.SESSION_TIME_OF_DAY)[0] ?? 0,
);

export const getAbsAdjust = withConnect(
  (): number => ir?.get(VARS.DC_ABS)[0] ?? 0,
);

export const getTcAdjust = withConnect(
  (): number => ir?.get(VARS.DC_TRACTION_CONTROL)[0] ?? 0,
);

export const getIsAbsActive = withConnect(
  (): boolean => ir?.get(VARS.BRAKE_ABS_ACTIVE)[0] ?? false,
);

export const getIsTcActive = withConnect(
  (): boolean => ir?.get(VARS.DC_TRACTION_CONTROL_TOGGLE)[0] ?? false,
);

export const getBrakeBias = withConnect(
  (): number => ir?.get(VARS.DC_BRAKE_BIAS)[0] ?? 0,
);

export const getIsPitSpeedLimiterActive = withConnect(
  (): boolean => ir?.get(VARS.DC_PIT_SPEED_LIMITER_TOGGLE)[0] ?? false,
);
