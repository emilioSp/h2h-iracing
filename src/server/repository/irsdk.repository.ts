// Reads iRacing telemetry when the backend refreshes or queries simulator state.
import { IRSDK, SESSION_DATA_KEYS, type Session, VARS } from '@emiliosp/node-iracing-sdk';

import { dataMode } from '#common/constants/data-mode.ts';
import { trackWetness } from '#common/constants/track-wetness.ts';
import { config } from '#config';
import { IRSDKMock } from '#repository/irsdk-mock.ts';
import { assertTelemetryFixture } from '#server/utils/assert-telemetry-fixture.ts';
import { assertTestEnvironment } from '#server/utils/assert-test-environment.ts';
import { debug } from '#server/utils/debug.ts';

const TRACK_WETNESS_LABELS = Object.values(trackWetness);

type LastLapTimeReader = {
  (): Promise<number[]>;
  (carIdx: number): Promise<number>;
};

export class IRSDKRepository {
  private ir: IRSDK | IRSDKMock | null = null;

  loadTelemetryFixture = (path: string): void => {
    assertTestEnvironment();
    this.ir = IRSDKMock.fromFixture(path);
  };

  resetIRSDK = (): void => {
    this.ir = null;
  };

  private connectToIRacing = async (): Promise<boolean> => {
    if (process.env.NODE_ENV === 'test') {
      assertTelemetryFixture(this.ir);
    } else if (!this.ir?.isConnected()) {
      try {
        this.ir =
          config.DATA_MODE === dataMode.MOCK
            ? IRSDK.fromDump(config.DUMP_FILE_PATH)
            : await IRSDK.connect();
      } catch (e) {
        debug('iRacing not available at the moment', e);
        this.ir = null;
      }
    }

    return (this.ir?.isConnected() ?? false) && (this.ir?.get(VARS.PLAYER_CAR_IDX)[0] ?? -1) >= 0;
  };

  isIRacingConnected = async (): Promise<boolean> => this.connectToIRacing();

  refreshTelemetry = async () => {
    await this.connectToIRacing();

    return this.ir?.refreshSharedMemory();
  };

  shutdown = async (): Promise<void> => {
    await this.connectToIRacing();

    return this.ir?.shutdown();
  };

  getPlayerCarIdx = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.PLAYER_CAR_IDX)[0] ?? -1;
  };

  // JUSTIFICATION: The optional index selects either all lap times or one car's time, matching these overloads.
  getLastLapTime = (async (carIdx?: number): Promise<number | number[]> => {
    await this.connectToIRacing();

    const lapTimes = this.ir?.get(VARS.CAR_IDX_LAST_LAP_TIME) ?? [];

    return carIdx === undefined ? lapTimes : (lapTimes[carIdx] ?? -1);
  }) as LastLapTimeReader;

  getBestLapTime = async (carIdx: number): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_IDX_BEST_LAP_TIME)[carIdx] ?? -1;
  };

  getLapsCompleted = async (): Promise<number[]> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_IDX_LAP_COMPLETED) ?? [];
  };

  getSessionTime = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.SESSION_TIME)[0] ?? 0;
  };

  getLapDistPct = async (): Promise<number[]> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_IDX_LAP_DIST_PCT) ?? [];
  };

  getOnPitRoad = async (): Promise<boolean[]> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_IDX_ON_PIT_ROAD) ?? [];
  };

  getSessionNum = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.SESSION_NUM)[0] ?? -1;
  };

  getRawDrivers = async () => {
    await this.connectToIRacing();

    return this.ir?.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO)?.Drivers ?? [];
  };

  getClassPositions = async (): Promise<number[]> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_IDX_CLASS_POSITION) ?? [];
  };

  getOverallPositions = async (): Promise<number[]> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_IDX_POSITION) ?? [];
  };

  getCurrentSessionInfo = async (): Promise<Session | null> => {
    await this.connectToIRacing();

    const sessionInfo = this.ir?.getSessionInfo(SESSION_DATA_KEYS.SESSION_INFO);

    const currentSession = sessionInfo?.Sessions?.find(
      (s) => s.SessionNum === sessionInfo.CurrentSessionNum,
    );

    if (!currentSession) {
      return null;
    }

    return currentSession;
  };

  getTrackLengthMeters = async (): Promise<number> => {
    await this.connectToIRacing();

    const weekendInfo = this.ir?.getSessionInfo(SESSION_DATA_KEYS.WEEKEND_INFO);

    if (!weekendInfo) {
      return 0;
    }

    return Number.parseFloat(weekendInfo.TrackLength) * 1000;
  };

  getAirTemperature = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.AIR_TEMP)[0] ?? 0;
  };

  getRelativeHumidity = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.RELATIVE_HUMIDITY)[0] ?? 0;
  };

  getTrackTemperature = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.TRACK_TEMP_CREW)[0] ?? 0;
  };

  getTrackWetness = async (): Promise<string> => {
    await this.connectToIRacing();

    const raw = this.ir?.get(VARS.TRACK_WETNESS)[0] ?? 0;

    return TRACK_WETNESS_LABELS[raw] ?? trackWetness.UNKNOWN;
  };

  getPrecipitation = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.PRECIPITATION)[0] ?? 0;
  };

  getWindDirection = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.WIND_DIR)[0] ?? 0;
  };

  getYawNorthDirection = async () => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.YAW_NORTH)[0] ?? 0;
  };

  getWindVelocity = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.WIND_VEL)[0] ?? 0;
  };

  getSessionSecondsAfterMidnight = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.SESSION_TIME_OF_DAY)[0] ?? 0;
  };

  getAbsAdjust = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.DC_ABS)[0] ?? 0;
  };

  getTcAdjust = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.DC_TRACTION_CONTROL)[0] ?? 0;
  };

  getIsAbsActive = async (): Promise<boolean> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.BRAKE_ABS_ACTIVE)[0] ?? false;
  };

  getBrakeBias = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.DC_BRAKE_BIAS)[0] ?? 0;
  };

  getIsPitSpeedLimiterActive = async (): Promise<boolean> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.DC_PIT_SPEED_LIMITER_TOGGLE)[0] ?? false;
  };

  getFuelLevel = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.FUEL_LEVEL)[0] ?? 0;
  };

  getSessionTimeRemain = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.SESSION_TIME_REMAIN)[0] ?? 0;
  };

  getSessionFlags = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.SESSION_FLAGS)[0] ?? 0;
  };

  getCarLeftRight = async (): Promise<number> => {
    await this.connectToIRacing();

    return this.ir?.get(VARS.CAR_LEFT_RIGHT)[0] ?? 0;
  };
}

export default new IRSDKRepository();
