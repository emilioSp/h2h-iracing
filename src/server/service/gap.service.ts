import {
  getLapDistPct,
  getLaps,
  getOnPitRoad,
} from '#repository/irsdk.repository.ts';
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import {
  getRefLap,
  interpolateTimeAtTrackPosition,
} from '#service/reference-lap.service.ts';

export type Gap = {
  value: number;
  unit: 'seconds' | 'laps';
};

const estimatedDelta = (
  classLapTime: number,
  aheadPct: number,
  behindPct: number,
): number => {
  let delta = aheadPct * classLapTime - behindPct * classLapTime;
  if (aheadPct < behindPct) delta += classLapTime;
  return Math.abs(delta);
};

const referenceDelta = (
  refLap: ReferenceLap,
  aheadPct: number,
  behindPct: number,
): number => {
  const timeAhead = interpolateTimeAtTrackPosition(refLap, aheadPct) ?? 0;
  const timeBehind = interpolateTimeAtTrackPosition(refLap, behindPct) ?? 0;
  let delta = timeAhead - timeBehind;
  const lapTime = refLap.finishTime - refLap.startTime;
  if (aheadPct < behindPct) delta += lapTime;
  return Math.abs(delta);
};

const computeGap = async (ahead: Car, behind: Car): Promise<Gap> => {
  if (ahead.driver.carIdx === behind.driver.carIdx)
    return { value: 0, unit: 'seconds' };

  const lapDistPct = await getLapDistPct();
  const laps = await getLaps();
  const aheadIdx = ahead.driver.carIdx;
  const behindIdx = behind.driver.carIdx;
  const aheadPct = lapDistPct[aheadIdx] ?? 0;
  const behindPct = lapDistPct[behindIdx] ?? 0;

  const lapDiff =
    (laps[aheadIdx] ?? 0) + aheadPct - ((laps[behindIdx] ?? 0) + behindPct);

  if (lapDiff >= 1.0) {
    return { value: Math.floor(lapDiff), unit: 'laps' };
  }

  const classLapTime = getClassEstLapTime(behindIdx);
  // TODO: restore 2
  if ((laps[behindIdx] ?? 0) < 15) {
    return {
      value: estimatedDelta(classLapTime, aheadPct, behindPct),
      unit: 'seconds',
    };
  }

  const onPitRoad = await getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] === 1 || onPitRoad[behindIdx] === 1;
  const refLap = getRefLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    return {
      value: referenceDelta(refLap, aheadPct, behindPct),
      unit: 'seconds',
    };
  }

  return {
    value: estimatedDelta(classLapTime, aheadPct, behindPct),
    unit: 'seconds',
  };
};

export const getGap = async (
  ahead: Car | null,
  player: Car,
  behind: Car | null,
): Promise<{ gapAhead: Gap | null; gapBehind: Gap | null }> => {
  const gapAhead = ahead !== null ? await computeGap(ahead, player) : null;
  const gapBehind = behind !== null ? await computeGap(player, behind) : null;
  return { gapAhead, gapBehind };
};
