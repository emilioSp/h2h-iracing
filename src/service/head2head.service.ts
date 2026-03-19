import type { Car, Driver, Head2Head } from '#schema/battle.schema.ts';
import {
  getBestLapTimes,
  getLaps,
  getLastLapTimes,
  getPlayerCarIdx,
  getSessionTime,
  isConnected,
  refreshTelemetry,
} from '../repository/irsdk.repository.ts';
import { getDriverInfo, refreshDriverInfo } from './driver.service.ts';
import { updateReferenceLaps } from './reference-lap.service.ts';
import { getStandings, type Standing } from './standings.service.ts';

const tick = (): void => {
  if (!isConnected()) {
    throw new Error('Not connected to iRacing');
  }
  refreshTelemetry();
  refreshDriverInfo();
  updateReferenceLaps();
};

export const computeCar = (
  carIdx: number,
  standings: Standing[],
): (Car & { driver: Driver }) | null => {
  let car: (Car & { driver: Driver }) | null = null;

  const carStanding = standings.find((s) => s.carIdx === carIdx)!;

  const driver = getDriverInfo(carIdx)!;

  const lastLapTimes = getLastLapTimes();
  const bestLapTimes = getBestLapTimes();
  const laps = getLaps();

  car = {
    driver,
    position: carStanding.pos,
    lastLapTime: (lastLapTimes[carIdx] ?? 0) > 0 ? lastLapTimes[carIdx] : NaN,
    bestLapTime: (bestLapTimes[carIdx] ?? 0) > 0 ? bestLapTimes[carIdx] : NaN,
    lap: laps[carIdx] ?? 0,
  };

  return car;
};

export const computeHead2Head = (): Head2Head | null => {
  tick();

  const playerIdx = getPlayerCarIdx();
  if (playerIdx < 0) return null;

  const standings = getStandings();
  const sessionTime = getSessionTime();

  const player = computeCar(playerIdx, standings);
  if (!player) return null;

  const aheadIdx =
    standings.find((s) => s.pos === player.position - 1)?.carIdx ?? -1;
  const behindIdx =
    standings.find((s) => s.pos === player.position + 1)?.carIdx ?? -1;

  let ahead: (Car & { driver: Driver }) | null = null;
  let behind: (Car & { driver: Driver }) | null = null;
  if (aheadIdx > 0) {
    ahead = computeCar(aheadIdx, standings);
  }
  if (behindIdx > 0) {
    behind = computeCar(behindIdx, standings);
  }

  return {
    sessionTime,
    player,
    ahead,
    behind,
  };
};
