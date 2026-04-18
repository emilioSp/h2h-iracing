import {
  getPlayerCarIdx,
  getSessionTime,
} from '#repository/irsdk.repository.ts';
import { isRaceSession } from '#repository/session-info.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import { computeCar } from '#service/car.service.ts';
import * as DeltaService from '#service/delta.service.ts';
import * as GapService from '#service/gap.service.ts';
import { updateReferenceLaps } from '#service/reference-lap.service.ts';
import { getStandings, type Standing } from '#service/standings.service.ts';

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

const computePlayerCar = async (playerIdx: number, standings: Standing[]) => {
  const player = await computeCar(playerIdx, standings);
  return player;
};

const computeAheadAndBehindCar = async (
  playerCar: Car,
  standings: Standing[],
) => {
  const aheadIdx =
    standings.find((s) => s.pos === playerCar.position - 1)?.carIdx ?? null;
  const behindIdx =
    standings.find((s) => s.pos === playerCar.position + 1)?.carIdx ?? null;

  const aheadCar: Car | null =
    aheadIdx !== null ? await computeCar(aheadIdx, standings) : null;
  const behindCar: Car | null =
    behindIdx !== null ? await computeCar(behindIdx, standings) : null;

  return { aheadCar, behindCar };
};

export const computeHead2Head = async (): Promise<Head2Head | null> => {
  const isRace = isRaceSession();
  if (isRace) {
    await updateReferenceLaps();
  }

  const playerIdx =
    process.env.DATA_MODE === 'mock' ? 4 : await getPlayerCarIdx();
  if (playerIdx < 0) return null;

  const standings = await getStandings(isRace);
  const sessionTime = await getSessionTime();

  const playerCar = await computePlayerCar(playerIdx, standings);
  if (playerCar.position === 0) {
    return {
      sessionTime,
      player: playerCar,
      ahead: null,
      behind: null,
      gapAhead: null,
      gapBehind: null,
      deltaAhead: null,
      deltaBehind: null,
    };
  }

  const { aheadCar, behindCar } = await computeAheadAndBehindCar(
    playerCar,
    standings,
  );
  const { gap, delta } = await getGapAndDelta(
    playerCar,
    aheadCar,
    behindCar,
    isRace,
  );

  return {
    sessionTime,
    player: playerCar,
    ahead: aheadCar,
    behind: behindCar,
    gapAhead: gap.gapAhead,
    gapBehind: gap.gapBehind,
    deltaAhead: delta.deltaAhead,
    deltaBehind: delta.deltaBehind,
  };
};
