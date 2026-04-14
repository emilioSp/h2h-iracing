import {
  getPlayerCarIdx,
  getSessionNum,
  getSessionTime,
  getTrackLengthMeters,
} from '#repository/irsdk.repository.ts';
import { resetReferenceLaps } from '#repository/reference-lap.repository.ts';
import { getSessionType } from '#repository/session-info.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import { computeCar } from '#service/car.service.ts';
import * as DeltaService from '#service/delta.service.ts';
import * as GapService from '#service/gap.service.ts';
import {
  initReferenceInterval,
  updateReferenceLaps,
} from '#service/reference-lap.service.ts';
import { getStandings } from '#service/standings.service.ts';

let previousSessionNum = -1;

const initTrackLengthMeters = async (): Promise<void> => {
  const trackLength = await getTrackLengthMeters();
  initReferenceInterval(trackLength);
};

const initReferenceLapsModule = async () => {
  const currentSessionNum = await getSessionNum();
  if (currentSessionNum !== previousSessionNum) {
    resetReferenceLaps();
    await initTrackLengthMeters();
    previousSessionNum = currentSessionNum;
  }
};

const isRaceSession = (): boolean => {
  const sessionType = getSessionType();
  return sessionType.toLowerCase() === 'race';
};

const getGapAndDelta = async (
  player: Car,
  ahead: Car | null,
  behind: Car | null,
  isRace: boolean,
): Promise<{ gap: GapService.GetGapOutput; delta: DeltaService.Delta }> => {
  const gap = isRace
    ? await GapService.getGap(ahead, player, behind)
    : { gapAhead: null, gapBehind: null };

  const delta = isRace
    ? DeltaService.getDeltaLastLap(player, ahead, behind)
    : DeltaService.getDeltaBestLap(player, ahead, behind);

  return {
    gap,
    delta,
  };
};

export const computeHead2Head = async (): Promise<Head2Head | null> => {
  await initReferenceLapsModule();

  const isRace = isRaceSession();
  if (isRace) {
    await updateReferenceLaps();
  }

  const playerIdx =
    process.env.DATA_MODE === 'mock' ? 4 : await getPlayerCarIdx();
  if (playerIdx < 0) return null;

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

  const { gap, delta } = await getGapAndDelta(player, ahead, behind, isRace);

  return {
    sessionTime,
    player,
    ahead,
    behind,
    gapAhead: gap.gapAhead,
    gapBehind: gap.gapBehind,
    deltaAhead: delta.deltaAhead,
    deltaBehind: delta.deltaBehind,
  };
};

export const cleanUpHead2Head = async (): Promise<void> => {
  resetReferenceLaps();
  previousSessionNum = -1;
};
