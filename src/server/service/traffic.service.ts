// Selects and orders faster cars behind the player when computing traffic warnings.
import { TRAFFIC_WINDOW_SECONDS } from '#common/constants/traffic.ts';
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import type { TrafficCar } from '#schema/traffic.schema.ts';
import { estimatedDelta } from '#server/utils/estimated-delta.ts';
import { guessCarClass } from '#server/utils/guess-car-class.ts';
import { isFasterCar } from '#server/utils/is-faster-car.ts';
import { referenceDelta } from '#server/utils/reference-delta.ts';
import { wrapLapDelta } from '#server/utils/track-position.ts';

const MIN_LAPS_FOR_REFERENCE = 2;

type GetGapSecondsInput = {
  refLap: ReferenceLap | null;
  classLapTime: number;
  playerPct: number;
  carPct: number;
  lapsCompleted: number;
  isAnyOnPitRoad: boolean;
  referenceInterval: number;
};

const getGapSeconds = ({
  refLap,
  classLapTime,
  playerPct,
  carPct,
  lapsCompleted,
  isAnyOnPitRoad,
  referenceInterval,
}: GetGapSecondsInput): number => {
  const hasReference =
    refLap !== null &&
    refLap.finishTime > 0 &&
    lapsCompleted >= MIN_LAPS_FOR_REFERENCE &&
    !isAnyOnPitRoad;

  return hasReference
    ? referenceDelta({ refLap, aheadPct: playerPct, behindPct: carPct, referenceInterval })
    : estimatedDelta({ classLapTime, aheadPct: playerPct, behindPct: carPct });
};

type FindTrafficBehindInput = {
  playerCarIdx: number;
  playerClassEstLapTime: number;
  drivers: Driver[];
  lapDistPct: number[];
  lapsCompleted: number[];
  onPitRoad: boolean[];
  referenceLaps: ReadonlyMap<number, ReferenceLap>;
  referenceInterval: number;
};

export const findTrafficBehind = ({
  playerCarIdx,
  playerClassEstLapTime,
  drivers,
  lapDistPct,
  lapsCompleted,
  onPitRoad,
  referenceLaps,
  referenceInterval,
}: FindTrafficBehindInput): TrafficCar[] => {
  const playerPct = lapDistPct[playerCarIdx];

  if (playerPct === undefined || playerPct < 0) return [];

  const cars: TrafficCar[] = [];

  for (const driver of drivers) {
    const { carIdx } = driver;

    if (carIdx === playerCarIdx) continue;

    if (onPitRoad[carIdx]) continue;

    const carPct = lapDistPct[carIdx];

    if (carPct === undefined || carPct < 0) continue;

    if (
      !isFasterCar({
        carClassEstLapTime: driver.classEstLapTime,
        playerClassEstLapTime,
      })
    )
      continue;

    if (wrapLapDelta(playerPct - carPct) < 0) continue;

    const gapSeconds = getGapSeconds({
      refLap: referenceLaps.get(carIdx) ?? null,
      referenceInterval,
      classLapTime: driver.classEstLapTime,
      playerPct,
      carPct,
      lapsCompleted: lapsCompleted[carIdx] ?? 0,
      isAnyOnPitRoad: onPitRoad[playerCarIdx],
    });

    if (gapSeconds > TRAFFIC_WINDOW_SECONDS) continue;

    cars.push({
      carIdx,
      carNumber: driver.carNumber,
      driverName: driver.name,
      className: guessCarClass(driver.car),
      license: driver.license,
      iRating: driver.iRating,
      gapSeconds,
    });
  }

  return cars.sort((a, b) => a.gapSeconds - b.gapSeconds);
};
