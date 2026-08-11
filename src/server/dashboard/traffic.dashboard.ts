import { getCarsIdx, getDriverInfo } from '#repository/driver.repository.ts';
import {
  getLapDistPct,
  getLapsCompleted,
  getOnPitRoad,
  getPlayerCarIdx,
} from '#repository/irsdk.repository.ts';
import { getRefLap } from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import type { Traffic } from '#schema/traffic.schema.ts';
import { findTrafficBehind } from '#service/traffic.service.ts';

const NO_TRAFFIC: Traffic = { cars: [] };

export const computeTraffic = async (): Promise<Traffic> => {
  const playerCarIdx = await getPlayerCarIdx();
  if (playerCarIdx < 0) return NO_TRAFFIC;

  const onPitRoad = await getOnPitRoad();
  if (onPitRoad[playerCarIdx]) return NO_TRAFFIC;

  const player = getDriverInfo(playerCarIdx);
  if (!player) return NO_TRAFFIC;

  const drivers = (await getCarsIdx())
    .map(getDriverInfo)
    .filter((driver): driver is Driver => driver !== null);

  return {
    cars: findTrafficBehind({
      playerCarIdx,
      playerClassEstLapTime: player.classEstLapTime,
      drivers,
      lapDistPct: await getLapDistPct(),
      lapsCompleted: await getLapsCompleted(),
      onPitRoad,
      getRefLapFor: getRefLap,
    }),
  };
};
