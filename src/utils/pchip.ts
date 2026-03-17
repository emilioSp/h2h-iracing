export const REFERENCE_INTERVAL = 0.0025;
const DECIMAL_PLACES = REFERENCE_INTERVAL.toString().split('.')[1]?.length || 0;

export type ReferencePoint = {
  trackPct: number;
  timeElapsedSinceStart: number;
  tangent: number | undefined;
};

export type ReferenceLap = {
  refPoints: Map<number, ReferencePoint>;
  startTime: number;
  finishTime: number;
  lastTrackedPct: number;
  isCleanLap: boolean;
};

export const normalizeKey = (key: number): number => {
  const normalizedKey = Number.parseFloat(
    (key - (key % REFERENCE_INTERVAL)).toFixed(DECIMAL_PLACES),
  );
  return normalizedKey < 0 || normalizedKey >= 1 ? 0 : normalizedKey;
};

const computePCHIPTangents = (
  x: number[],
  y: number[],
  lapTime: number,
): number[] => {
  const n = x.length;
  const tangents = new Array<number>(n);
  const deltas = new Array<number>(n - 1);

  for (let k = 0; k < n - 1; k++) {
    deltas[k] = (y[k + 1] - y[k]) / (x[k + 1] - x[k]);
  }

  const deltaBeforeFirst =
    (y[0] - (y[n - 1] - lapTime)) / (x[0] - (x[n - 1] - 1));
  const deltaAfterLast =
    (y[0] + lapTime - y[n - 1]) / (x[0] + 1 - x[n - 1]);

  const d0 = deltaBeforeFirst;
  const d1 = deltas[0];
  if (d0 * d1 <= 0) {
    tangents[0] = 0;
  } else {
    const dxAfter = x[1] - x[0];
    const dxBefore = x[0] - (x[n - 1] - 1);
    const w1 = 2 * dxAfter + dxBefore;
    const w2 = dxAfter + 2 * dxBefore;
    tangents[0] = (w1 + w2) / (w1 / d0 + w2 / d1);
  }

  const dNm2 = deltas[n - 2];
  const dNm1 = deltaAfterLast;
  if (dNm2 * dNm1 <= 0) {
    tangents[n - 1] = 0;
  } else {
    const dxBefore = x[n - 1] - x[n - 2];
    const dxAfter = x[0] + 1 - x[n - 1];
    const w1 = 2 * dxAfter + dxBefore;
    const w2 = dxAfter + 2 * dxBefore;
    tangents[n - 1] = (w1 + w2) / (w1 / dNm2 + w2 / dNm1);
  }

  for (let k = 1; k < n - 1; k++) {
    const dk = deltas[k - 1];
    const dkp1 = deltas[k];
    if (dk * dkp1 <= 0) {
      tangents[k] = 0;
    } else {
      const w1 = 2 * (x[k + 1] - x[k]) + (x[k] - x[k - 1]);
      const w2 = x[k + 1] - x[k] + 2 * (x[k] - x[k - 1]);
      tangents[k] = (w1 + w2) / (w1 / dk + w2 / dkp1);
    }
  }

  return tangents;
};

export const precomputePCHIPTangents = (lap: ReferenceLap): void => {
  const sorted = Array.from(lap.refPoints.values()).sort(
    (a, b) => a.trackPct - b.trackPct,
  );

  if (sorted.length < 2) return;

  const x = sorted.map((p) => p.trackPct);
  const y = sorted.map((p) => p.timeElapsedSinceStart);
  const tangents = computePCHIPTangents(x, y, lap.finishTime - lap.startTime);

  for (let i = 0; i < sorted.length; i++) {
    sorted[i].tangent = tangents[i];
  }
};

const hermiteBasis = (
  t: number,
  y0: number,
  y1: number,
  m0: number,
  m1: number,
): number => {
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return h00 * y0 + h10 * m0 + h01 * y1 + h11 * m1;
};

export const interpolateAtPoint = (
  lap: ReferenceLap,
  targetPct: number,
): number | null => {
  const key0 = normalizeKey(targetPct);
  const key1 = normalizeKey(targetPct + REFERENCE_INTERVAL);

  const p0 = lap.refPoints.get(key0);
  const p1 = lap.refPoints.get(key1);

  if (!p0) return null;
  if (!p1) return p0.timeElapsedSinceStart;

  if (p0.tangent === undefined || p1.tangent === undefined) {
    const hLin = p1.trackPct - p0.trackPct;
    if (hLin <= 0) return p0.timeElapsedSinceStart;
    const tLin = (targetPct - p0.trackPct) / hLin;
    return (
      p0.timeElapsedSinceStart +
      tLin * (p1.timeElapsedSinceStart - p0.timeElapsedSinceStart)
    );
  }

  let h = p1.trackPct - p0.trackPct;
  let y1 = p1.timeElapsedSinceStart;

  if (h <= 0) {
    h = 1 - p0.trackPct + p1.trackPct;
    y1 = p1.timeElapsedSinceStart + (lap.finishTime - lap.startTime);
  }

  const t = (targetPct - p0.trackPct) / h;

  return hermiteBasis(
    t,
    p0.timeElapsedSinceStart,
    y1,
    p0.tangent * h,
    p1.tangent * h,
  );
};
