import {
  getSessionNum,
  getTrackLengthMeters,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';
import { refreshDriverInfo } from '#service/driver.service.ts';
import {
  initReferenceInterval,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';

let previousSessionNum = -1;

export const resetSessionNumber = (): void => {
  previousSessionNum = -1;
};

const initTrackLengthMeters = async (): Promise<void> => {
  const trackLength = await getTrackLengthMeters();
  initReferenceInterval(trackLength);
};

export const tick = async (): Promise<void> => {
  await refreshTelemetry();

  // Reset reference laps if session changed (practice, qualify, race)
  const currentSessionNum = await getSessionNum();
  if (currentSessionNum !== previousSessionNum) {
    resetReferenceLaps();
    await initTrackLengthMeters();
    previousSessionNum = currentSessionNum;
  }

  await refreshDriverInfo();
  await refreshCurrentSessionInfo();
  await updateReferenceLaps();
};
