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

export type RelativeEntry = {
  carIdx: number;
  relativePct: number;
  delta: number;
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

export const getGap = (carIdxA: number, carIdxB: number): number => {
  if (carIdxA === carIdxB) return 0;

  const lapDistPct = getLapDistPct();
  const pctA = lapDistPct[carIdxA];
  const pctB = lapDistPct[carIdxB];

  const relPct = getRelativeDistanceInPerc(pctA, pctB);
  const isBAhead = relPct > 0;
  const aheadIdx = isBAhead ? carIdxB : carIdxA;
  const behindIdx = isBAhead ? carIdxA : carIdxB;
  const aheadPct = isBAhead ? pctB : pctA;
  const behindPct = isBAhead ? pctA : pctB;

  const laps = getLaps();
  const classLapTime = getClassEstLapTime(behindIdx);
  if ((laps[behindIdx] ?? 0) < 2) {
    return estimatedDelta(getEstTime(), classLapTime, aheadIdx, behindIdx);
  }

  const onPitRoad = getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] === 1 || onPitRoad[behindIdx] === 1;
  const refLap = getBestRefLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    return referenceDelta(refLap, aheadPct, behindPct);
  }

  return estimatedDelta(getEstTime(), classLapTime, aheadIdx, behindIdx);
};

export const getRelatives = (
  focusCarIdx: number,
  buffer = 5,
  activeCarIdxs?: Set<number>,
): RelativeEntry[] => {
  const lapDistPct = getLapDistPct();
  const focusPct = lapDistPct[focusCarIdx] ?? -1;
  if (focusPct < 0) return [];

  const entries: { carIdx: number; relativePct: number }[] = [];
  for (let i = 0; i < lapDistPct.length; i++) {
    if ((lapDistPct[i] ?? -1) < 0) continue;
    if (activeCarIdxs && !activeCarIdxs.has(i)) continue;
    entries.push({
      carIdx: i,
      relativePct: getRelativeDistanceInPerc(focusPct, lapDistPct[i]),
    });
  }

  entries.sort((a, b) => b.relativePct - a.relativePct);

  const focusIdx = entries.findIndex((e) => e.carIdx === focusCarIdx);
  if (focusIdx === -1) return [];

  const start = Math.max(0, focusIdx - buffer);
  const end = Math.min(entries.length, focusIdx + 1 + buffer);

  return entries.slice(start, end).map((e) => ({
    carIdx: e.carIdx,
    relativePct: e.relativePct,
    delta: getGap(focusCarIdx, e.carIdx),
  }));
};
