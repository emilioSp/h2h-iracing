import {
  isConnected,
  refreshTelemetry,
} from '../repository/telemetry.repository.ts';

export const tick = (): void => {
  if (!isConnected()) {
    throw new Error('Not connected to iRacing');
  }
  refreshTelemetry();
};