import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { resetFuelTracking } from '#repository/fuel.repository.ts';
import {
  getSessionNum,
  getTrackLengthMeters,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';
import { resetLapTimeTracking } from '#repository/lap.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';
import { initReferenceInterval } from '#service/reference-lap.service.ts';

let previousSessionNum = -1;

const initTrackLengthMeters = async (): Promise<void> => {
  const trackLength = await getTrackLengthMeters();
  initReferenceInterval(trackLength);
};

export const resetInMemoryStorage = () => {
  resetReferenceLaps();
  resetFuelTracking();
  resetLapTimeTracking();
};

export const onSessionChange = async () => {
  const currentSessionNum = await getSessionNum();
  if (currentSessionNum === previousSessionNum) {
    return;
  }

  await initTrackLengthMeters();
  resetInMemoryStorage();

  previousSessionNum = currentSessionNum;
};

export const tick = async (): Promise<void> => {
  await refreshTelemetry();
  await refreshDriverInfo();
  await refreshCurrentSessionInfo();

  await onSessionChange();
};
