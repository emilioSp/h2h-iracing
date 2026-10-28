// Orders class positions when a non-race session requests standings.
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { Standing } from '#service/standings.service.ts';

export const getSessionStandings = async (): Promise<Standing[]> => {
  const carIdxs = await driverRepository.getPlayerClassCarIdx();
  const classPositions = await irsdkRepository.getClassPositions();

  return carIdxs
    .filter((carIdx) => classPositions[carIdx] > 0)
    .map((carIdx) => ({ pos: classPositions[carIdx], carIdx }))
    .sort((a, b) => a.pos - b.pos);
};
