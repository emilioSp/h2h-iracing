import {
  getEstTime,
  getLapDistPct,
  getLaps,
  getOnPitRoad,
} from '#repository/irsdk.repository.ts';
import { getBestRefLap } from '#repository/reference-lap.repository.ts';
import { getClassEstLapTime } from '#service/driver.service.ts';
import type { ReferenceLap } from '#utils/pchip.ts';
import { interpolateAtPoint } from '#utils/pchip.ts';

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
): Promise<number> => {
  if (carIdxA === carIdxB) return 0;

  const lapDistPct = await getLapDistPct();
  const pctA = lapDistPct[carIdxA];
  const pctB = lapDistPct[carIdxB];

  const relPct = getRelativeDistanceInPerc(pctA, pctB);
  const isBAhead = relPct > 0;
  const aheadIdx = isBAhead ? carIdxB : carIdxA;
  const behindIdx = isBAhead ? carIdxA : carIdxB;
  const aheadPct = isBAhead ? pctB : pctA;
  const behindPct = isBAhead ? pctA : pctB;

  const laps = await getLaps();
  const classLapTime = getClassEstLapTime(behindIdx);
  if ((laps[behindIdx] ?? 0) < 2) {
    return estimatedDelta(
      await getEstTime(),
      classLapTime,
      aheadIdx,
      behindIdx,
    );
  }

  const onPitRoad = await getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] === 1 || onPitRoad[behindIdx] === 1;
  const refLap = getBestRefLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    return referenceDelta(refLap, aheadPct, behindPct);
  }

  return estimatedDelta(await getEstTime(), classLapTime, aheadIdx, behindIdx);
};
