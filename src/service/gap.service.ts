import { getBestLap } from '../repository/reference-lap.repository.ts';
import {
  getLapDistPct,
  getOnPitRoad,
} from '../repository/telemetry.repository.ts';
import type { ReferenceLap } from '../utils/pchip.ts';
import { interpolateAtPoint } from '../utils/pchip.ts';

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

const referenceDelta = (
  refLap: ReferenceLap,
  opponentPct: number,
  playerPct: number,
): number => {
  const timePlayer = interpolateAtPoint(refLap, playerPct) ?? 0;
  const timeOpponent = interpolateAtPoint(refLap, opponentPct) ?? 0;
  let delta = timeOpponent - timePlayer;
  const lapTime = refLap.finishTime - refLap.startTime;
  if (delta <= -lapTime / 2) delta += lapTime;
  else if (delta >= lapTime / 2) delta -= lapTime;
  return delta;
};

export const getGap = (carIdxA: number, carIdxB: number): number => {
  if (carIdxA === carIdxB) return 0;

  const lapDistPct = getLapDistPct();
  const pctA = lapDistPct[carIdxA] ?? -1;
  const pctB = lapDistPct[carIdxB] ?? -1;
  if (pctA < 0 || pctB < 0) return NaN;

  const relPct = getRelativeDistanceInPerc(pctA, pctB);
  const isBAhead = relPct > 0;
  const aheadIdx = isBAhead ? carIdxB : carIdxA;
  const behindIdx = isBAhead ? carIdxA : carIdxB;

  const onPitRoad = getOnPitRoad();
  const anyOnPit = onPitRoad[aheadIdx] === 1 || onPitRoad[behindIdx] === 1;

  const refLap = getBestLap(behindIdx);
  const hasRefData = refLap !== null && refLap.finishTime > 0;

  if (!anyOnPit && hasRefData) {
    return referenceDelta(refLap, pctB, pctA);
  }

  // we still don't have a refLap. Instead of displaying wrong data, I prefer to return NaN. In this context it means N/A
  // TODO: add a repository for driverInfo
  // TODO: fetch classReference lap from driverInfo
  return NaN;
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
