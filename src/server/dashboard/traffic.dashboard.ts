// Computes the traffic payload for callers that have checked the repository connection.
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import type { Traffic } from '#schema/traffic.schema.ts';
import referenceLapService from '#service/reference-lap.service.ts';
import { findTrafficBehind } from '#service/traffic.service.ts';

const NO_TRAFFIC: Traffic = { cars: [] };

export const computeTraffic = async (): Promise<Traffic> => {
  const playerCarIdx = await irsdkRepository.getPlayerCarIdx();

  const onPitRoad = await irsdkRepository.getOnPitRoad();

  if (onPitRoad[playerCarIdx]) return NO_TRAFFIC;

  // Usable player connections are assumed to have driver metadata.
  const player = driverRepository.getDriverInfo(playerCarIdx)!;

  const drivers = (await driverRepository.getCarsIdx())
    .map(driverRepository.getDriverInfo)
    .filter((driver): driver is Driver => driver !== null);

  return {
    cars: findTrafficBehind({
      playerCarIdx,
      playerClassEstLapTime: player.classEstLapTime,
      drivers,
      lapDistPct: await irsdkRepository.getLapDistPct(),
      lapsCompleted: await irsdkRepository.getLapsCompleted(),
      onPitRoad,
      referenceLaps: new Map(
        drivers.flatMap(({ carIdx }) => {
          const lap = referenceLapRepository.getRefLap(carIdx);

          return lap ? [[carIdx, lap] as const] : [];
        }),
      ),
      referenceInterval: referenceLapService.getReferenceInterval(),
    }),
  };
};
