// Compares best lap times when computing head-to-head pace deltas.
import { lapTimeDelta } from '#server/utils/lap-time-delta.ts';
import type { Delta, GetDeltaInput } from '#service/delta.service.ts';

export const getDeltaBestLap = ({ player, ahead, behind }: GetDeltaInput): Delta => ({
  deltaAhead: lapTimeDelta({ playerLapTime: player.bestLapTime, otherLapTime: ahead?.bestLapTime }),
  deltaBehind: lapTimeDelta({
    playerLapTime: player.bestLapTime,
    otherLapTime: behind?.bestLapTime,
  }),
});
