import {
  isConnected,
  refreshTelemetry,
} from '../repository/irsdk.repository.ts';
import { refreshDriverInfo } from './driver.service.ts';

export const tick = (): void => {
  if (!isConnected()) {
    throw new Error('Not connected to iRacing');
  }
  refreshTelemetry();
  refreshDriverInfo();
};
