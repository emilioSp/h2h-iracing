// Verifies fixture-backed SDK behavior during regression tests.
import { SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import { describe, expect, it } from 'vitest';

import { IRSDKMock } from '#repository/irsdk-mock.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';

describe('IRSDKMock', () => {
  it('given a telemetry fixture when it is loaded then its variables and session data are available', () => {
    const sdk = IRSDKMock.fromFixture('tests/fixtures/telemetry-mock/frames/advancing-frames.json');

    expect({
      airTemperature: sdk.get(VARS.AIR_TEMP),
      windVelocity: sdk.get(VARS.WIND_VEL),
      trackLength: sdk.getSessionInfo(SESSION_DATA_KEYS.WEEKEND_INFO).TrackLength,
    }).toEqual({
      airTemperature: [10],
      windVelocity: [4],
      trackLength: '5.0 km',
    });
  });

  it('given a fixture with multiple frames when telemetry is refreshed then the mock starts at the first frame and advances', () => {
    const sdk = IRSDKMock.fromFixture('tests/fixtures/telemetry-mock/frames/advancing-frames.json');

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([10]);
    sdk.refreshSharedMemory();
    expect(sdk.get(VARS.AIR_TEMP)).toEqual([20]);
    sdk.refreshSharedMemory();
    expect(sdk.get(VARS.AIR_TEMP)).toEqual([21]);
  });

  it('given a fixture with multiple frames when telemetry is refreshed past the final frame then the final frame remains active', () => {
    const sdk = IRSDKMock.fromFixture('tests/fixtures/telemetry-mock/frames/advancing-frames.json');

    sdk.refreshSharedMemory();
    sdk.refreshSharedMemory();
    sdk.refreshSharedMemory();

    expect(sdk.get(VARS.AIR_TEMP)).toEqual([21]);
  });

  it('given a connected fixture when it is loaded then the mock is connected', () => {
    const sdk = IRSDKMock.fromFixture('tests/fixtures/telemetry-mock/connection/connected.json');

    expect(sdk.isConnected()).toBe(true);
  });

  it('given a disconnected fixture when it is loaded then the test repository remains disconnected', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/connection/disconnected.json',
    );

    expect(await irsdkRepository.isIRacingConnected()).toBe(false);
  });

  it('given a connected mock when it is shut down then it disconnects', () => {
    const sdk = IRSDKMock.fromFixture('tests/fixtures/telemetry-mock/connection/connected.json');

    sdk.shutdown();

    expect(sdk.isConnected()).toBe(false);
  });
});
