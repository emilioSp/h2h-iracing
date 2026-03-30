import { getLapDistPct, getLaps } from '#repository/irsdk.repository.ts';
import { getCarIdxs } from '#service/driver.service.ts';

export type Standing = { pos: number; carIdx: number };

export const getStandings = async (): Promise<Standing[]> => {
  const carIdxs = await getCarIdxs();
  const lapDistPct = await getLapDistPct();
  const laps = await getLaps();

  const standings: Standing[] = carIdxs.map((carIdx) => ({ pos: 0, carIdx }));

  standings.sort((a, b) => {
    const distA = (laps[a.carIdx] ?? 0) + (lapDistPct[a.carIdx] ?? 0);
    const distB = (laps[b.carIdx] ?? 0) + (lapDistPct[b.carIdx] ?? 0);
    return distB - distA;
  });

  standings.forEach((s, i) => {
    s.pos = i + 1;
  });

  return standings;
};
