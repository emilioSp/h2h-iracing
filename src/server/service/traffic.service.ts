import { TRAFFIC_WINDOW_SECONDS } from '#common/constant.ts';
import {
  getRefLap,
  type ReferenceLap,
} from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import type { TrafficCar } from '#schema/traffic.schema.ts';
import { estimatedDelta, referenceDelta } from '#server/utils/gap-delta.ts';
import { guessCarClass } from '#server/utils/guess-car-class.ts';
import { wrapLapDelta } from '#server/utils/track-position.ts';

// iRacing reports every car of a mixed AI field as one class, so CarClassID and
// CarClassRelSpeed cannot order them. Only the estimated lap time separates a
// real class from the spread inside one: at Mugello the faster classes are
// 8.6-11.3 s quicker, while the GT3 cars differ by 0.6 s at most.
export const FASTER_CLASS_MARGIN_SECONDS = 5;

const MIN_LAPS_FOR_REFERENCE = 2;

type IsFasterCarInput = {
  carClassEstLapTime: number;
  playerClassEstLapTime: number;
};

export const isFasterCar = ({
  carClassEstLapTime,
  playerClassEstLapTime,
}: IsFasterCarInput): boolean =>
  carClassEstLapTime > 0 &&
  carClassEstLapTime <= playerClassEstLapTime - FASTER_CLASS_MARGIN_SECONDS;

type GetGapSecondsInput = {
  refLap: ReferenceLap | null;
  classLapTime: number;
  playerPct: number;
  carPct: number;
  lapsCompleted: number;
  isAnyOnPitRoad: boolean;
};

const getGapSeconds = ({
  refLap,
  classLapTime,
  playerPct,
  carPct,
  lapsCompleted,
  isAnyOnPitRoad,
}: GetGapSecondsInput): number => {
  const hasReference =
    refLap !== null &&
    refLap.finishTime > 0 &&
    lapsCompleted >= MIN_LAPS_FOR_REFERENCE &&
    !isAnyOnPitRoad;

  return hasReference
    ? referenceDelta({ refLap, aheadPct: playerPct, behindPct: carPct })
    : estimatedDelta({ classLapTime, aheadPct: playerPct, behindPct: carPct });
};

type FindTrafficBehindInput = {
  playerCarIdx: number;
  playerClassEstLapTime: number;
  drivers: Driver[];
  lapDistPct: number[];
  lapsCompleted: number[];
  onPitRoad: boolean[];
};

export const findTrafficBehind = ({
  playerCarIdx,
  playerClassEstLapTime,
  drivers,
  lapDistPct,
  lapsCompleted,
  onPitRoad,
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
      refLap: getRefLap(carIdx),
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
