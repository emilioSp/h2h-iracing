import {
  getDriverInfo,
  getLapDistPct,
  getLaps,
} from '../repository/telemetry.repository.ts';

export type Standing = { pos: number; carIdx: number };

export const getStandings = (): Standing[] => {
  const lapDistPct = getLapDistPct();
  const laps = getLaps();

  const standings: Standing[] = [];
  for (let i = 0; i < lapDistPct.length; i++) {
    if ((lapDistPct[i] ?? -1) < 0) continue;
    const driver = getDriverInfo(i);
    if (!driver || driver.name.toLowerCase() === 'pace car') continue;
    standings.push({ pos: 0, carIdx: i });
  }

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