// Resolves the last lap time when assembling car telemetry.
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';

export const computeLastLapTime = async (carIdx: number): Promise<number> => {
  const lastLapTime = await irsdkRepository.getLastLapTime(carIdx);

  if (lastLapTime > 0) return lastLapTime;

  // This is the case when a driver has left the session
  const sessionLastLapTime = sessionInfoRepository.getSessionLastLapTime(carIdx);

  if (sessionLastLapTime > 0) return sessionLastLapTime;

  return NaN;
};
