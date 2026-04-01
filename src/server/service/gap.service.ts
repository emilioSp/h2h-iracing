import fs from 'node:fs';
import {
  getEstTime,
  getLapDistPct,
  getLaps,
  getOnPitRoad,
} from '#repository/irsdk.repository.ts';
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import { getRefLap } from '#repository/reference-lap.repository.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import { interpolateTimeAtTrackPosition } from '#service/reference-lap.service.ts';

export type Gap = {
  value: number;
  unit: 'seconds' | 'laps';
};

const estimatedDelta = (
  estTime: number[],
  classLapTime: number,
  aheadIdx: number,
  behindIdx: number,
  aheadPct: number,
  behindPct: number,
): number => {
  let delta = (estTime[aheadIdx] ?? 0) - (estTime[behindIdx] ?? 0);
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

export const getGap = async (
  carIdxA: number,
  carIdxB: number,
): Promise<Gap> => {
  if (carIdxA === carIdxB) return { value: 0, unit: 'seconds' };

  const [lapDistPct, laps] = await Promise.all([getLapDistPct(), getLaps()]);
  const pctA = lapDistPct[carIdxA] ?? 0;
  const pctB = lapDistPct[carIdxB] ?? 0;

  const lapsA = laps[carIdxA] ?? 0;
  const lapsB = laps[carIdxB] ?? 0;

  const totalA = lapsA + pctA;
  const totalB = lapsB + pctB;
  const isBAhead = totalB > totalA;
  const trueLapDiff = Math.abs(totalA - totalB);

  if (trueLapDiff >= 1.0) {
    return { value: Math.floor(trueLapDiff), unit: 'laps' };
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
        aheadPct,
        behindPct,
      ),
      unit: 'seconds',
    };
  }

  const onPitRoad = await getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] === 1 || onPitRoad[behindIdx] === 1;
  const refLap = getRefLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    const value = referenceDelta(refLap, aheadPct, behindPct);
    if (value >= 50) {
      const debug = {
        aheadIdx,
        behindIdx,
        aheadPct,
        behindPct,
        refLap: JSON.stringify(refLap, null, 2),
      };
      fs.writeFileSync(
        `debug_${Date.now()}.log`,
        JSON.stringify(debug, null, 2),
      );

      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      console.log('FERMATEEEEEEE');
      throw new Error('MAMT!');
    }
    return {
      value,
      unit: 'seconds',
    };
  }

  return {
    value: estimatedDelta(
      await getEstTime(),
      classLapTime,
      aheadIdx,
      behindIdx,
      aheadPct,
      behindPct,
    ),
    unit: 'seconds',
  };
};
