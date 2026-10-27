// Resolves the best lap time when assembling car telemetry.
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';

export const computeBestLapTime = async (carIdx: number): Promise<number> => {
  const bestLapTime = await irsdkRepository.getBestLapTime(carIdx);

  if (bestLapTime > 0) return bestLapTime;

  const sessionBestTime = sessionInfoRepository.getSessionBestTime(carIdx);

  if (sessionBestTime > 0) return sessionBestTime;

  return NaN;
};
