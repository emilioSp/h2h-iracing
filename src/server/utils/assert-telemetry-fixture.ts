// Requires a loaded mock before tests can query telemetry, preventing live SDK connections.
import type { IRSDK } from '@emiliosp/node-iracing-sdk';

import { IRSDKMock } from '#repository/irsdk-mock.ts';

export function assertTelemetryFixture(
  value: IRSDK | IRSDKMock | null,
): asserts value is IRSDKMock {
  if (!(value instanceof IRSDKMock)) {
    throw new Error('Load a telemetry fixture before reading telemetry');
  }
}
