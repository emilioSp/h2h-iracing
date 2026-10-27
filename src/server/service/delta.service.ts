// Compares last lap times when computing head-to-head race pace.
import type { Car } from '#schema/car.schema.ts';
import { lapTimeDelta } from '#server/utils/lap-time-delta.ts';

export type Delta = {
  deltaAhead: number | null;
  deltaBehind: number | null;
};

export type GetDeltaInput = {
  player: Car;
  ahead: Car | null;
  behind: Car | null;
};

export const getDeltaLastLap = ({ player, ahead, behind }: GetDeltaInput): Delta => ({
  deltaAhead: lapTimeDelta({ playerLapTime: player.lastLapTime, otherLapTime: ahead?.lastLapTime }),
  deltaBehind: lapTimeDelta({
    playerLapTime: player.lastLapTime,
    otherLapTime: behind?.lastLapTime,
  }),
});
