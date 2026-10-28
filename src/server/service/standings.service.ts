// Orders cars by race distance when the head-to-head overlay requests standings.
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';

export type Standing = { pos: number; carIdx: number };

export const getRaceStandings = async (): Promise<Standing[]> => {
  const carIdxs = await driverRepository.getPlayerClassCarIdx();
  const lapDistPct = await irsdkRepository.getLapDistPct();
  const lapsCompleted = await irsdkRepository.getLapsCompleted();

  const standings: Standing[] = carIdxs.map((carIdx) => ({ pos: 0, carIdx }));

  standings.sort((a, b) => {
    const distA =
      (lapsCompleted[a.carIdx] ?? sessionInfoRepository.getSessionLapsCompleted(a.carIdx) ?? 0) +
      (lapDistPct[a.carIdx] ?? 0);

    const distB =
      (lapsCompleted[b.carIdx] ?? sessionInfoRepository.getSessionLapsCompleted(b.carIdx) ?? 0) +
      (lapDistPct[b.carIdx] ?? 0);

    return distB - distA;
  });

  standings.forEach((s, i) => {
    s.pos = i + 1;
  });

  return standings;
};
