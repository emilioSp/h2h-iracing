import { getClassEstLapTime } from '#repository/driver.repository.ts';
import {
  getLapDistPct,
  getLapsCompleted,
  getOnPitRoad,
} from '#repository/irsdk.repository.ts';
import {
  getRefLap,
  type ReferenceLap,
} from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import { interpolateTimeAtTrackPosition } from '#service/reference-lap.service.ts';

export type Gap = {
  value: number;
  unit: 'seconds' | 'laps';
};

type EstimatedDeltaInput = {
  classLapTime: number;
  aheadPct: number;
  behindPct: number;
};

export const estimatedDelta = ({
  classLapTime,
  aheadPct,
  behindPct,
}: EstimatedDeltaInput): number => {
  let delta = aheadPct * classLapTime - behindPct * classLapTime;
  if (aheadPct < behindPct) delta += classLapTime;
  return Math.abs(delta);
};

type ReferenceDeltaInput = {
  refLap: ReferenceLap;
  aheadPct: number;
  behindPct: number;
};

export const referenceDelta = ({
  refLap,
  aheadPct,
  behindPct,
}: ReferenceDeltaInput): number => {
  const timeAhead =
    interpolateTimeAtTrackPosition({
      lap: refLap,
      currentTrackPositionPct: aheadPct,
    }) ?? 0;
  const timeBehind =
    interpolateTimeAtTrackPosition({
      lap: refLap,
      currentTrackPositionPct: behindPct,
    }) ?? 0;
  let delta = timeAhead - timeBehind;
  const lapTime = refLap.finishTime - refLap.startTime;
  if (aheadPct < behindPct) delta += lapTime;
  return Math.abs(delta);
};

type ComputeGapInput = {
  ahead: Car;
  behind: Car;
};

const computeGap = async ({ ahead, behind }: ComputeGapInput): Promise<Gap> => {
  if (ahead.driver.carIdx === behind.driver.carIdx)
    return { value: 0, unit: 'seconds' };

  const lapDistPct = await getLapDistPct();
  const lapsCompleted = await getLapsCompleted();
  const aheadIdx = ahead.driver.carIdx;
  const behindIdx = behind.driver.carIdx;
  const aheadPct = lapDistPct[aheadIdx] ?? 0;
  const behindPct = lapDistPct[behindIdx] ?? 0;

  const lapDiff =
    (lapsCompleted[aheadIdx] ?? 0) +
    aheadPct -
    ((lapsCompleted[behindIdx] ?? 0) + behindPct);

  if (lapDiff >= 1.0) {
    return { value: Math.floor(lapDiff), unit: 'laps' };
  }

  const classLapTime = getClassEstLapTime(behindIdx);
  if ((lapsCompleted[behindIdx] ?? 0) < 2) {
    return {
      value: estimatedDelta({ classLapTime, aheadPct, behindPct }),
      unit: 'seconds',
    };
  }

  const onPitRoad = await getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] || onPitRoad[behindIdx];
  const refLap = getRefLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    return {
      value: referenceDelta({ refLap, aheadPct, behindPct }),
      unit: 'seconds',
    };
  }

  return {
    value: estimatedDelta({ classLapTime, aheadPct, behindPct }),
    unit: 'seconds',
  };
};

export type GetGapOutput = { gapAhead: Gap | null; gapBehind: Gap | null };

export type GetGapInput = {
  ahead: Car | null;
  player: Car;
  behind: Car | null;
};

export const getGap = async ({
  ahead,
  player,
  behind,
}: GetGapInput): Promise<GetGapOutput> => {
  const gapAhead =
    ahead !== null ? await computeGap({ ahead, behind: player }) : null;
  const gapBehind =
    behind !== null ? await computeGap({ ahead: player, behind }) : null;
  return { gapAhead, gapBehind };
};
