import type {
  BattleState,
  CarState,
  DriverInfo,
} from '#schema/battle.schema.ts';
import {
  getBestLapTimes,
  getDriverInfo,
  getF2Times,
  getLaps,
  getLastLapTimes,
  getPlayerCarIdx,
  getPositions,
  getSessionTime,
  isConnected,
  refreshTelemetry,
} from '../repository/telemetry.repository.ts';

const buildCarState = (
  carIdx: number,
  positions: number[],
  lastLapTimes: number[],
  bestLapTimes: number[],
  laps: number[],
): (CarState & { driver: DriverInfo }) | null => {
  const driver = getDriverInfo(carIdx);
  if (!driver) return null;

  return {
    driver,
    position: positions[carIdx] ?? 0,
    lastLapTime: lastLapTimes[carIdx] > 0 ? lastLapTimes[carIdx] : NaN,
    bestLapTime: bestLapTimes[carIdx] > 0 ? bestLapTimes[carIdx] : NaN,
    lap: laps[carIdx] ?? 0,
  };
};

export const computeBattleState = (): BattleState | null => {
  if (!isConnected()) {
    throw new Error('Not connected to iRacing');
  }

  refreshTelemetry();
  const playerIdx = getPlayerCarIdx();
  const positions = getPositions();

  if (playerIdx < 0 || positions.length === 0) return null;

  const playerPos = positions[playerIdx];
  if (playerPos <= 0) return null;

  const lastLapTimes = getLastLapTimes();
  const bestLapTimes = getBestLapTimes();
  const f2Times = getF2Times();
  const laps = getLaps();
  const sessionTime = getSessionTime();

  const player = buildCarState(
    playerIdx,
    positions,
    lastLapTimes,
    bestLapTimes,
    laps,
  );
  if (!player) return null;

  const aheadIdx = positions.findIndex((pos) => pos === playerPos - 1);
  const behindIdx = positions.findIndex((pos) => pos === playerPos + 1);

  const ahead =
    aheadIdx >= 0
      ? buildCarState(aheadIdx, positions, lastLapTimes, bestLapTimes, laps)
      : null;

  const behind =
    behindIdx >= 0
      ? buildCarState(behindIdx, positions, lastLapTimes, bestLapTimes, laps)
      : null;

  const playerF2 = f2Times[playerIdx] ?? -1;

  const gapAhead =
    aheadIdx >= 0 && (f2Times[aheadIdx] ?? -1) >= 0 && playerF2 >= 0
      ? playerF2 - f2Times[aheadIdx]
      : NaN;

  const gapBehind =
    behindIdx >= 0 && (f2Times[behindIdx] ?? -1) >= 0 && playerF2 >= 0
      ? f2Times[behindIdx] - playerF2
      : NaN;

  const playerLap = player.lastLapTime;
  const aheadLap = ahead?.lastLapTime ?? NaN;
  const behindLap = behind?.lastLapTime ?? NaN;

  const deltaAhead =
    aheadIdx >= 0 && Number.isFinite(playerLap) && Number.isFinite(aheadLap)
      ? aheadLap - playerLap
      : NaN;

  const deltaBehind =
    behindIdx >= 0 && Number.isFinite(playerLap) && Number.isFinite(behindLap)
      ? behindLap - playerLap
      : NaN;

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
