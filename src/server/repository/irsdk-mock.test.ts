import { SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import { describe, expect, it } from 'vitest';
import {
  isIRacingConnected,
  loadTelemetryFixture,
} from '#repository/irsdk.repository.ts';
import { IRSDKMock } from '#repository/irsdk-mock.ts';

describe('IRSDKMock', () => {
  it('When a telemetry fixture is loaded then its variables and session data are available', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/frames/advancing-frames.json',
    );

    expect({
      airTemperature: sdk.get(VARS.AIR_TEMP),
      windVelocity: sdk.get(VARS.WIND_VEL),
      trackLength: sdk.getSessionInfo(SESSION_DATA_KEYS.WEEKEND_INFO)
        .TrackLength,
    }).toEqual({
      airTemperature: [10],
      windVelocity: [4],
      trackLength: '5.0 km',
    });
  });

  it('When telemetry is refreshed then the mock starts at the first frame and advances', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/frames/advancing-frames.json',
    );

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([10]);
    sdk.refreshSharedMemory();
    expect(sdk.get(VARS.AIR_TEMP)).toEqual([20]);
    sdk.refreshSharedMemory();
    expect(sdk.get(VARS.AIR_TEMP)).toEqual([21]);
  });

  it('When telemetry is refreshed past the final frame then the final frame remains active', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/frames/advancing-frames.json',
    );

    sdk.refreshSharedMemory();
    sdk.refreshSharedMemory();
    sdk.refreshSharedMemory();

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([21]);
  });

  it('When a connected fixture is loaded then the mock is connected', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/connection/connected.json',
    );

    expect(sdk.isConnected()).toBe(true);
  });

  it('When a disconnected fixture is loaded then the test repository remains disconnected', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/connection/disconnected.json');

    expect(await isIRacingConnected()).toBe(false);
  });

  it('When a connected mock is shut down then it disconnects', () => {
    const sdk = IRSDKMock.fromFixture(
      'fixture/telemetry-mock/connection/connected.json',
    );

    sdk.shutdown();

    expect(sdk.isConnected()).toBe(false);
  });
});
