import type { Car } from '#schema/car.schema.ts';

export type Delta = {
  deltaAhead: number | null;
  deltaBehind: number | null;
};

export const getDeltaLastLap = (
  player: Car,
  ahead: Car | null,
  behind: Car | null,
): Delta => {
  let deltaAhead: number | null = null;
  if (ahead && player.lastLapTime > 1 && ahead.lastLapTime > 1) {
    deltaAhead = player.lastLapTime - ahead.lastLapTime;
  }

  let deltaBehind: number | null = null;
  if (behind && player.lastLapTime > 1 && behind.lastLapTime > 1) {
    deltaBehind = player.lastLapTime - behind.lastLapTime;
  }

  return {
    deltaAhead,
    deltaBehind,
  };
};

export const getDeltaBestLap = (
  player: Car,
  ahead: Car | null,
  behind: Car | null,
): Delta => {
  let deltaAhead: number | null = null;
  if (ahead && player.bestLapTime > 1 && ahead.bestLapTime > 1) {
    deltaAhead = player.bestLapTime - ahead.bestLapTime;
  }

  let deltaBehind: number | null = null;
  if (behind && player.bestLapTime > 1 && behind.bestLapTime > 1) {
    deltaBehind = player.bestLapTime - behind.bestLapTime;
  }

  return {
    deltaAhead,
    deltaBehind,
  };
};
