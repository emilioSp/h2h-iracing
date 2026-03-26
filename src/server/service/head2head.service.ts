import {
  getBestLapTime,
  getLaps,
  getLastLapTime,
  getPlayerCarIdx,
  getSessionTime,
  isIRacingConnected,
  refreshTelemetry,
} from '#repository/irsdk.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Driver } from '#schema/driver.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import { getDriverInfo, refreshDriverInfo } from '#service/driver.service.ts';
import { getGap } from '#service/gap.service.ts';
import {
  getBestRefLapTime,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';
import { getStandings, type Standing } from '#service/standings.service.ts';

const tick = (): boolean => {
  if (!isIRacingConnected()) return false;
  refreshTelemetry();
  refreshDriverInfo();
  updateReferenceLaps();
  return true;
};

export const computeCar = (
  carIdx: number,
  standings: Standing[],
): Car & { driver: Driver } => {
  const carStanding = standings.find((s) => s.carIdx === carIdx)!;

  const driver = getDriverInfo(carIdx)!;

  const laps = getLaps();

  const car = {
    driver,
    position: carStanding.pos,
    lastLapTime: getLastLapTime(carIdx),
    bestLapTime: getBestLapTime(carIdx),
    lap: laps[carIdx] ?? 0,
  };

  return car;
};

export const computeHead2Head = (): Head2Head | null => {
  if (!tick()) return null;

  const playerIdx = process.env.DATA_MODE === 'mock' ? 4 : getPlayerCarIdx();
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

  const gapAhead = aheadIdx > 0 ? getGap(playerIdx, aheadIdx) : NaN;
  const gapBehind = behindIdx > 0 ? getGap(playerIdx, behindIdx) : NaN;

  const playerLap = player.lastLapTime;
  const aheadLap = ahead?.lastLapTime ?? NaN;
  const behindLap = behind?.lastLapTime ?? NaN;

  const deltaAhead = playerLap > 1 && aheadLap > 1 ? playerLap - aheadLap : NaN;
  const deltaBehind =
    playerLap > 1 && behindLap > 1 ? playerLap - behindLap : NaN;

  const bestRefLapTime = getBestRefLapTime(playerIdx);

  return {
    sessionTime,
    player,
    ahead,
    behind,
    gapAhead,
    gapBehind,
    deltaAhead,
    deltaBehind,
    bestRefLapTime,
  };
};
