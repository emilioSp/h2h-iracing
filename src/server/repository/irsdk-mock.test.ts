import { SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import { describe, expect, it } from 'vitest';
import { IRSDKMock } from '#repository/irsdk-mock.ts';

describe('IRSDKMock', () => {
  it('reads variables and session data', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/frames/base.json',
    );

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([10]);
    expect(sdk.get(VARS.WIND_VEL)).toEqual([4]);
    expect(sdk.getSessionInfo(SESSION_DATA_KEYS.WEEKEND_INFO).TrackLength).toBe(
      '5.0 km',
    );
  });

  it('uses the first frame for the first refresh and then advances', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/frames/base.json',
    );

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([10]);
    sdk.refreshSharedMemory();
    expect(sdk.get(VARS.AIR_TEMP)).toEqual([20]);
    sdk.refreshSharedMemory();
    expect(sdk.get(VARS.AIR_TEMP)).toEqual([21]);
  });

  it('keeps the last frame active', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/frames/base.json',
    );

    sdk.refreshSharedMemory();
    sdk.refreshSharedMemory();
    sdk.refreshSharedMemory();

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([21]);
  });

  it('supports connected, disconnected, and shutdown states', () => {
    const connected = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/connection/connected.json',
    );
    const disconnected = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/connection/disconnected.json',
    );

    expect(connected.isConnected()).toBe(true);
    expect(disconnected.isConnected()).toBe(false);

    connected.shutdown();
    expect(connected.isConnected()).toBe(false);
  });
});
