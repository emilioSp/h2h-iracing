import { getCarIdxs } from '#repository/driver.repository.ts';
import {
  getClassPositions,
  getLapDistPct,
  getLapsCompleted,
} from '#repository/irsdk.repository.ts';
import { getSessionLapsCompleted } from '#repository/session-info.repository.ts';

export type Standing = { pos: number; carIdx: number };

export const getRaceStandings = async (): Promise<Standing[]> => {
  const carIdxs = await getCarIdxs();
  const lapDistPct = await getLapDistPct();
  const lapsCompleted = await getLapsCompleted();

  const standings: Standing[] = carIdxs.map((carIdx) => ({ pos: 0, carIdx }));

  standings.sort((a, b) => {
    const distA =
      (lapsCompleted[a.carIdx] ?? getSessionLapsCompleted(a.carIdx) ?? 0) +
      (lapDistPct[a.carIdx] ?? 0);
    const distB =
      (lapsCompleted[b.carIdx] ?? getSessionLapsCompleted(b.carIdx) ?? 0) +
      (lapDistPct[b.carIdx] ?? 0);
    return distB - distA;
  });

  standings.forEach((s, i) => {
    s.pos = i + 1;
  });

  return standings;
};

export const getSessionStandings = async (): Promise<Standing[]> => {
  const carIdxs = await getCarIdxs();
  const classPositions = await getClassPositions();

  return carIdxs
    .filter((carIdx) => classPositions[carIdx] > 0)
    .map((carIdx) => ({ pos: classPositions[carIdx], carIdx }))
    .sort((a, b) => a.pos - b.pos);
};

export const getStandings = (isRace: boolean): Promise<Standing[]> =>
  isRace ? getRaceStandings() : getSessionStandings();
