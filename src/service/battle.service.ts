import type { BattleState } from '#schema/battle.schema.ts';
import {
  getBestLapTimes,
  getLaps,
  getLastLapTimes,
  getPlayerCarIdx,
  getSessionTime,
} from '../repository/telemetry.repository.ts';
import { buildCarState } from './car-state.service.ts';
import { getStandings } from './standings.service.ts';

export const computeBattleState = (): BattleState | null => {
  const playerIdx = getPlayerCarIdx();
  if (playerIdx < 0) return null;

  const standings = getStandings();
  const playerStanding = standings.find((s) => s.carIdx === playerIdx);
  if (!playerStanding) return null;

  const playerPos = playerStanding.pos;
  const lastLapTimes = getLastLapTimes();
  const bestLapTimes = getBestLapTimes();
  const laps = getLaps();
  const sessionTime = getSessionTime();

  const player = buildCarState(
    playerIdx,
    playerPos,
    lastLapTimes,
    bestLapTimes,
    laps,
  );
  if (!player) return null;

  const aheadStanding = standings.find((s) => s.pos === playerPos - 1);
  const behindStanding = standings.find((s) => s.pos === playerPos + 1);

  const aheadIdx = aheadStanding?.carIdx ?? -1;
  const behindIdx = behindStanding?.carIdx ?? -1;

  const ahead = aheadStanding
    ? buildCarState(
        aheadStanding.carIdx,
        aheadStanding.pos,
        lastLapTimes,
        bestLapTimes,
        laps,
      )
    : null;

  const behind = behindStanding
    ? buildCarState(
        behindStanding.carIdx,
        behindStanding.pos,
        lastLapTimes,
        bestLapTimes,
        laps,
      )
    : null;

  const playerLap = player.lastLapTime;
  const aheadLap = ahead?.lastLapTime ?? NaN;
  const behindLap = behind?.lastLapTime ?? NaN;

  const deltaAhead =
    aheadIdx >= 0 && Number.isFinite(playerLap) && Number.isFinite(aheadLap)
      ? playerLap - aheadLap
      : NaN;

  const deltaBehind =
    behindIdx >= 0 && Number.isFinite(playerLap) && Number.isFinite(behindLap)
      ? playerLap - behindLap
      : NaN;

  return {
    sessionTime,
    player,
    ahead,
    behind,
    deltaAhead,
    deltaBehind,
  };
};
