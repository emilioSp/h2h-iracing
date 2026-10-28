// Selects lap or time gaps from telemetry when computing the head-to-head payload.
import { gapUnit, type GapUnit } from '#common/constants/gap-unit.ts';
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import { estimatedDelta } from '#server/utils/estimated-delta.ts';
import { referenceDelta } from '#server/utils/reference-delta.ts';
import referenceLapService from '#service/reference-lap.service.ts';

export type Gap = {
  value: number;
  unit: GapUnit;
};

type ComputeGapInput = {
  ahead: Car;
  behind: Car;
};

const computeGap = async ({ ahead, behind }: ComputeGapInput): Promise<Gap> => {
  if (ahead.driver.carIdx === behind.driver.carIdx) return { value: 0, unit: gapUnit.SECONDS };

  const lapDistPct = await irsdkRepository.getLapDistPct();
  const lapsCompleted = await irsdkRepository.getLapsCompleted();
  const aheadIdx = ahead.driver.carIdx;
  const behindIdx = behind.driver.carIdx;
  const aheadPct = lapDistPct[aheadIdx] ?? 0;
  const behindPct = lapDistPct[behindIdx] ?? 0;

  const lapDiff =
    (lapsCompleted[aheadIdx] ?? 0) + aheadPct - ((lapsCompleted[behindIdx] ?? 0) + behindPct);

  if (lapDiff >= 1.0) {
    return { value: Math.floor(lapDiff), unit: gapUnit.LAPS };
  }

  const classLapTime = driverRepository.getClassEstLapTime(behindIdx);

  if ((lapsCompleted[behindIdx] ?? 0) < 2) {
    return {
      value: estimatedDelta({
        classLapTime,
        aheadPct,
        behindPct,
      }),
      unit: gapUnit.SECONDS,
    };
  }

  const onPitRoad = await irsdkRepository.getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] || onPitRoad[behindIdx];
  const refLap = referenceLapRepository.getRefLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    return {
      value: referenceDelta({
        refLap,
        aheadPct,
        behindPct,
        referenceInterval: referenceLapService.getReferenceInterval(),
      }),
      unit: gapUnit.SECONDS,
    };
  }

  return {
    value: estimatedDelta({
      classLapTime,
      aheadPct,
      behindPct,
    }),
    unit: gapUnit.SECONDS,
  };
};

export type GetGapOutput = { gapAhead: Gap | null; gapBehind: Gap | null };

export type GetGapInput = {
  ahead: Car | null;
  player: Car;
  behind: Car | null;
};

export const getGap = async ({ ahead, player, behind }: GetGapInput): Promise<GetGapOutput> => {
  const gapAhead = ahead !== null ? await computeGap({ ahead, behind: player }) : null;
  const gapBehind = behind !== null ? await computeGap({ ahead: player, behind }) : null;

  return { gapAhead, gapBehind };
};
