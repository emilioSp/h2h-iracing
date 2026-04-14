import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { refreshTelemetry } from '#repository/irsdk.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';

export const tick = async (): Promise<void> => {
  await refreshTelemetry();
  await refreshDriverInfo();
  await refreshCurrentSessionInfo();
};
