import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as driverRepository from '#repository/driver.repository.ts';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import * as sessionInfoRepository from '#repository/session-info.repository.ts';
import {
  computeBestLapTime,
  computeCar,
  computeLastLapTime,
} from '#service/car.service.ts';
import type { Standing } from '#service/standings.service.ts';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('computeLastLapTime', () => {
  it('returns the irsdk lap time when positive', async () => {
    vi.spyOn(iracingRepository, 'getLastLapTime').mockResolvedValue(85.5);

    expect(await computeLastLapTime(1)).toBe(85.5);
  });

  it('falls back to session info when irsdk returns 0', async () => {
    vi.spyOn(iracingRepository, 'getLastLapTime').mockResolvedValue(0);
    vi.spyOn(sessionInfoRepository, 'getSessionLastLapTime').mockReturnValue(
      86.2,
    );

    expect(await computeLastLapTime(1)).toBe(86.2);
  });

  it('returns NaN when both sources return 0', async () => {
    vi.spyOn(iracingRepository, 'getLastLapTime').mockResolvedValue(0);
    vi.spyOn(sessionInfoRepository, 'getSessionLastLapTime').mockReturnValue(0);

    expect(await computeLastLapTime(1)).toBeNaN();
  });
});

describe('computeBestLapTime', () => {
  it('returns the irsdk best lap time when positive', async () => {
    vi.spyOn(iracingRepository, 'getBestLapTime').mockResolvedValue(84.1);

    expect(await computeBestLapTime(1)).toBe(84.1);
  });

  it('falls back to session info when irsdk returns 0', async () => {
    vi.spyOn(iracingRepository, 'getBestLapTime').mockResolvedValue(0);
    vi.spyOn(sessionInfoRepository, 'getSessionBestTime').mockReturnValue(83.9);

    expect(await computeBestLapTime(1)).toBe(83.9);
  });

  it('returns NaN when both sources return 0', async () => {
    vi.spyOn(iracingRepository, 'getBestLapTime').mockResolvedValue(0);
    vi.spyOn(sessionInfoRepository, 'getSessionBestTime').mockReturnValue(0);

    expect(await computeBestLapTime(1)).toBeNaN();
  });
});

describe('computeCar', () => {
  const standings: Standing[] = [{ carIdx: 7, pos: 3 }];

  beforeEach(() => {
    vi.spyOn(driverRepository, 'getDriverInfo').mockReturnValue({
      carIdx: 7,
      name: 'Test Driver',
      carNumber: '07',
      car: 'Ferrari',
      iRating: 3000,
      license: 'A 4.99',
      classEstLapTime: 84.1,
    });
    const laps = Array(64).fill(0);
    laps[7] = 10;
    vi.spyOn(iracingRepository, 'getLapsCompleted').mockResolvedValue(laps);
    vi.spyOn(iracingRepository, 'getLastLapTime').mockResolvedValue(85.5);
    vi.spyOn(iracingRepository, 'getBestLapTime').mockResolvedValue(84.1);
  });

  it('assembles a Car from standing and repositories', async () => {
    const car = await computeCar(7, standings);

    expect(car).toEqual({
      driver: expect.objectContaining({ name: 'Test Driver' }),
      position: 3,
      lastLapTime: 85.5,
      bestLapTime: 84.1,
      lap: 10,
    });
  });

  it('uses position 0 when carIdx is not in standings', async () => {
    const car = await computeCar(99, standings);

    expect(car.position).toBe(0);
  });

  it('falls back to session laps when irsdk laps are missing', async () => {
    vi.spyOn(iracingRepository, 'getLapsCompleted').mockResolvedValue([]);
    vi.spyOn(sessionInfoRepository, 'getSessionLapsCompleted').mockReturnValue(
      5,
    );

    const car = await computeCar(7, standings);

    expect(car.lap).toBe(5);
  });
});
