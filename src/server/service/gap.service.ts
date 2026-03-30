import {
  getEstTime,
  getLapDistPct,
  getLaps,
  getOnPitRoad,
} from '#repository/irsdk.repository.ts';
import { getRefLap } from '#repository/reference-lap.repository.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import type { ReferenceLap } from '#utils/pchip.ts';
import { interpolateAtPoint } from '#utils/pchip.ts';

export type Gap = {
  value: number;
  unit: 'seconds' | 'laps';
  method: 'est' | 'ref' | 'lap';
};

const getRelativeDistanceInPerc = (pctA: number, pctB: number): number => {
  let rel = pctB - pctA;
  // manage wrap up (one car crossed finish line)
  if (rel > 0.5) rel -= 1.0;
  else if (rel < -0.5) rel += 1.0;

  return rel;
};

const estimatedDelta = (
  estTime: number[],
  classLapTime: number,
  aheadIdx: number,
  behindIdx: number,
): number => {
  let delta = (estTime[aheadIdx] ?? 0) - (estTime[behindIdx] ?? 0);
  if (delta <= -classLapTime / 2) delta += classLapTime;
  else if (delta > classLapTime / 2) delta -= classLapTime;
  return Math.abs(delta);
};

const referenceDelta = (
  refLap: ReferenceLap,
  aheadPct: number,
  behindPct: number,
): number => {
  const timeAhead = interpolateAtPoint(refLap, aheadPct) ?? 0;
  const timeBehind = interpolateAtPoint(refLap, behindPct) ?? 0;
  let delta = timeAhead - timeBehind;
  const lapTime = refLap.finishTime - refLap.startTime;
  if (delta <= -lapTime / 2) delta += lapTime;
  else if (delta >= lapTime / 2) delta -= lapTime;
  return Math.abs(delta);
};

export const getGap = async (
  carIdxA: number,
  carIdxB: number,
): Promise<Gap> => {
  if (carIdxA === carIdxB) return { value: 0, unit: 'seconds', method: 'est' };

  const [lapDistPct, laps] = await Promise.all([getLapDistPct(), getLaps()]);
  const pctA = lapDistPct[carIdxA] ?? 0;
  const pctB = lapDistPct[carIdxB] ?? 0;

  const lapsA = laps[carIdxA] ?? 0;
  const lapsB = laps[carIdxB] ?? 0;

  let isBAhead: boolean;
  let trueLapDiff: number;

  if (lapsA === lapsB) {
    const relPct = getRelativeDistanceInPerc(pctA, pctB);
    isBAhead = relPct > 0;
    trueLapDiff = Math.abs(relPct);
  } else {
    const totalA = lapsA + pctA;
    const totalB = lapsB + pctB;
    isBAhead = totalB > totalA;
    trueLapDiff = Math.abs(totalA - totalB);
  }

  if (trueLapDiff >= 1.0) {
    return { value: Math.floor(trueLapDiff), unit: 'laps', method: 'lap' };
  }

  const aheadIdx = isBAhead ? carIdxB : carIdxA;
  const behindIdx = isBAhead ? carIdxA : carIdxB;
  const aheadPct = isBAhead ? pctB : pctA;
  const behindPct = isBAhead ? pctA : pctB;

  const classLapTime = getClassEstLapTime(behindIdx);
  if ((laps[behindIdx] ?? 0) < 2) {
    return {
      value: estimatedDelta(
        await getEstTime(),
        classLapTime,
        aheadIdx,
        behindIdx,
      ),
      unit: 'seconds',
      method: 'est',
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
      method: 'ref',
    };
  }

  return {
    value: estimatedDelta(
      await getEstTime(),
      classLapTime,
      aheadIdx,
      behindIdx,
    ),
    unit: 'seconds',
    method: 'est',
  };
};
