import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as driverRepository from '#repository/driver.repository.ts';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import * as referenceLapRepository from '#repository/reference-lap.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';
import { computeTraffic } from '#server/dashboard/traffic.dashboard.ts';

const PLAYER_CAR_IDX = 0;

// Player drives a GT3. Car 1 is an LMP2 just behind, car 2 another GT3.
const drivers: Driver[] = [
  {
    carIdx: 0,
    name: 'Emilio Spatola',
    carNumber: '64',
    car: 'Ferrari 296 GT3',
    iRating: 3000,
    license: 'A 3.51',
    classEstLapTime: 103.1952,
  },
  {
    carIdx: 1,
    name: 'Aussie Greg Hill',
    carNumber: '6',
    car: 'Dallara P217 LMP2',
    iRating: 4200,
    license: 'B 2.10',
    classEstLapTime: 94.5768,
  },
  {
    carIdx: 2,
    name: 'John Hughes',
    carNumber: '2',
    car: 'Acura NSX GT3 EVO 22',
    iRating: 1500,
    license: 'C 1.99',
    classEstLapTime: 103.2057,
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubEnv('DATA_MODE', 'live');
  vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(
    PLAYER_CAR_IDX,
  );
  vi.spyOn(iracingRepository, 'getLapDistPct').mockResolvedValue([
    0.2, 0.199, 0.198,
  ]);
  vi.spyOn(iracingRepository, 'getLapsCompleted').mockResolvedValue([0, 0, 0]);
  vi.spyOn(iracingRepository, 'getOnPitRoad').mockResolvedValue([
    false,
    false,
    false,
  ]);
  vi.spyOn(driverRepository, 'getCarsIdx').mockResolvedValue([0, 1, 2]);
  vi.spyOn(driverRepository, 'getDriverInfo').mockImplementation(
    (carIdx: number) => drivers.find((d) => d.carIdx === carIdx) ?? null,
  );
  vi.spyOn(referenceLapRepository, 'getRefLap').mockReturnValue(null);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('computeTraffic', () => {
  it('reports the faster car behind and skips the same-class car', async () => {
    const traffic = await computeTraffic();

    expect(traffic.cars).toHaveLength(1);
    expect(traffic.cars[0]).toMatchObject({
      carIdx: 1,
      carNumber: '6',
      driverName: 'Aussie Greg Hill',
      className: 'LMP2',
      license: 'B 2.10',
      iRating: 4200,
    });
  });

  it('reports nothing when the player is not in a car', async () => {
    vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(-1);

    expect(await computeTraffic()).toEqual({ cars: [] });
  });

  it('reports nothing when the player is on the pit road', async () => {
    vi.spyOn(iracingRepository, 'getOnPitRoad').mockResolvedValue([
      true,
      false,
      false,
    ]);

    expect(await computeTraffic()).toEqual({ cars: [] });
  });

  it('reports nothing when the player has no driver data', async () => {
    vi.spyOn(driverRepository, 'getDriverInfo').mockReturnValue(null);

    expect(await computeTraffic()).toEqual({ cars: [] });
  });
});
