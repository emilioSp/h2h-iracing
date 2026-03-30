import {
  getBestLapTime,
  getLaps,
  getLastLapTime,
  getPlayerCarIdx,
  getSessionNum,
  getSessionTime,
  isIRacingConnected,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Driver } from '#schema/driver.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import { getDriverInfo, refreshDriverInfo } from '#service/driver.service.ts';
import { getGap } from '#service/gap.service.ts';
import { updateReferenceLaps } from '#service/reference-lap.service.ts';
import { getStandings, type Standing } from '#service/standings.service.ts';

let previousSessionNum = -1;

const tick = async (): Promise<boolean> => {
  if (await !isIRacingConnected()) {
    resetReferenceLaps();
    return false;
  }
  await refreshTelemetry();

  // Reset reference laps if session changed (practice, qualify, race)
  const currentSessionNum = await getSessionNum();
  if (currentSessionNum !== previousSessionNum) {
    resetReferenceLaps();
    previousSessionNum = currentSessionNum;
  }

  await refreshDriverInfo();
  await updateReferenceLaps();
  return true;
};

export const computeCar = async (
  carIdx: number,
  standings: Standing[],
): Promise<Car & { driver: Driver }> => {
  const carStanding = standings.find((s) => s.carIdx === carIdx)!;

  const driver = getDriverInfo(carIdx)!;

  const laps = await getLaps();

  const car = {
    driver,
    position: carStanding.pos,
    lastLapTime: await getLastLapTime(carIdx),
    bestLapTime: await getBestLapTime(carIdx),
    lap: laps[carIdx] ?? 0,
  };

  return car;
};

export const computeHead2Head = async (): Promise<Head2Head | null> => {
  if (!tick()) return null;

  const playerIdx =
    process.env.DATA_MODE === 'mock' ? 4 : await getPlayerCarIdx();
  if (playerIdx < 0) return null;

  const standings = await getStandings();
  const sessionTime = await getSessionTime();

  const player = await computeCar(playerIdx, standings);
  if (!player) return null;

  const aheadIdx =
    standings.find((s) => s.pos === player.position - 1)?.carIdx ?? -1;
  const behindIdx =
    standings.find((s) => s.pos === player.position + 1)?.carIdx ?? -1;

  let ahead: (Car & { driver: Driver }) | null = null;
  let behind: (Car & { driver: Driver }) | null = null;
  if (aheadIdx > 0) {
    ahead = await computeCar(aheadIdx, standings);
  }
  if (behindIdx > 0) {
    behind = await computeCar(behindIdx, standings);
  }

  const gapAhead = aheadIdx > 0 ? await getGap(playerIdx, aheadIdx) : null;
  const gapBehind = behindIdx > 0 ? await getGap(playerIdx, behindIdx) : null;

  const playerLap = player.lastLapTime;
  const aheadLap = ahead?.lastLapTime ?? NaN;
  const behindLap = behind?.lastLapTime ?? NaN;

  const deltaAhead = playerLap > 1 && aheadLap > 1 ? playerLap - aheadLap : NaN;
  const deltaBehind =
    playerLap > 1 && behindLap > 1 ? playerLap - behindLap : NaN;

  return {
    sessionTime,
    player,
    ahead,
    behind,
    gapAhead,
    gapBehind,
    deltaAhead,
    deltaBehind,
  };
};
