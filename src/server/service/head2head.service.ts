import { getDriverInfo } from '#repository/driver.repository.ts';
import {
  getBestLapTime,
  getLapsCompleted,
  getLastLapTime,
  getPlayerCarIdx,
  getSessionTime,
  getSessionType,
} from '#repository/irsdk.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import {
  getSessionBestTime,
  getSessionLapsCompleted,
  getSessionLastLapTime,
} from '#repository/session-info.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import {
  type Delta,
  getDeltaBestLap,
  getDeltaLastLap,
} from '#service/delta.service.ts';
import { getGap } from '#service/gap.service.ts';
import { getStandings, type Standing } from '#service/standings.service.ts';
import { resetSessionNumber } from '#service/tick.service.ts';

export const computeLastLapTime = async (carIdx: number) => {
  let lastLapTime = await getLastLapTime(carIdx);
  if (lastLapTime > 0) return lastLapTime;

  lastLapTime = getSessionLastLapTime(carIdx);
  if (lastLapTime > 0) return lastLapTime;

  return NaN;
};

export const computeBestLapTime = async (carIdx: number) => {
  let bestLapTime = await getBestLapTime(carIdx);
  if (bestLapTime > 0) return bestLapTime;

  bestLapTime = getSessionBestTime(carIdx);
  if (bestLapTime > 0) return bestLapTime;

  return NaN;
};

export const computeCar = async (
  carIdx: number,
  standings: Standing[],
): Promise<Car> => {
  const carStanding = standings.find((s) => s.carIdx === carIdx);

  // biome-ignore lint/style/noNonNullAssertion: we assume the driver info is always available for valid carIdx
  const driver = getDriverInfo(carIdx)!;

  const lapsCompleted = await getLapsCompleted();

  const car = {
    driver,
    position: carStanding?.pos ?? 0,
    lastLapTime: await computeLastLapTime(carIdx),
    bestLapTime: await computeBestLapTime(carIdx),
    lap: lapsCompleted[carIdx] ?? getSessionLapsCompleted(carIdx) ?? 0, // TODO: use lapNumber
  };

  return car;
};

export const computeHead2Head = async (): Promise<Head2Head | null> => {
  const playerIdx =
    process.env.DATA_MODE === 'mock' ? 4 : await getPlayerCarIdx();
  if (playerIdx < 0) return null;

  const sessionType = await getSessionType();
  const isRace = sessionType.includes('Race');
  const standings = await getStandings(isRace);
  const sessionTime = await getSessionTime();

  const player = await computeCar(playerIdx, standings);
  if (player.position === 0) {
    return {
      sessionTime,
      player,
      ahead: null,
      behind: null,
      gapAhead: null,
      gapBehind: null,
      deltaAhead: null,
      deltaBehind: null,
    };
  }

  const aheadIdx =
    standings.find((s) => s.pos === player.position - 1)?.carIdx ?? -1;
  const behindIdx =
    standings.find((s) => s.pos === player.position + 1)?.carIdx ?? -1;

  let ahead: Car | null = null;
  let behind: Car | null = null;
  if (aheadIdx > 0) {
    ahead = await computeCar(aheadIdx, standings);
  }
  if (behindIdx > 0) {
    behind = await computeCar(behindIdx, standings);
  }

  const { gapAhead, gapBehind } = isRace
    ? await getGap(ahead, player, behind)
    : { gapAhead: null, gapBehind: null };

  const delta: Delta = isRace
    ? getDeltaLastLap(player, ahead, behind)
    : getDeltaBestLap(player, ahead, behind);

  return {
    sessionTime,
    player,
    ahead,
    behind,
    gapAhead,
    gapBehind,
    deltaAhead: delta.deltaAhead,
    deltaBehind: delta.deltaBehind,
  };
};

export const cleanUpHead2Head = async (): Promise<void> => {
  resetReferenceLaps();
  resetSessionNumber();
};
