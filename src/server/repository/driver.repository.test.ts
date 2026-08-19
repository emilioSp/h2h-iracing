import { describe, expect, it } from 'vitest';
import {
  getClassEstLapTime,
  getDriverInfo,
  getFilteredRawDrivers,
  getPlayerClassCarIdx,
  refreshDriverInfo,
} from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';

describe('driver.repository', () => {
  describe('getFilteredRawDrivers', () => {
    it('returns drivers in the player class', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/same-class.json');

      const result = await getFilteredRawDrivers();

      const names = result.map((driver) => driver.UserName);
      expect(names).toContain('Player');
      expect(names).toContain('Same Class');
      expect(names).not.toContain('Other Class');
    });

    it('excludes drivers with an invalid car index', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/invalid-index.json');

      const result = await getFilteredRawDrivers();

      expect(result.every((driver) => driver.CarIdx > -1)).toBe(true);
      expect(result.some((driver) => driver.UserName === 'Slot Zero')).toBe(
        false,
      );
    });

    it('excludes pace cars', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/pace-car.json');

      const result = await getFilteredRawDrivers();

      expect(result.every((driver) => !driver.CarIsPaceCar)).toBe(true);
    });
  });

  describe('driver map', () => {
    it('returns driver data after refresh', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/refresh.json');
      await refreshDriverInfo();

      expect(getDriverInfo(5)).toEqual({
        carIdx: 5,
        name: 'Alice',
        carNumber: '42',
        car: 'GT3 Car',
        iRating: 3500,
        license: 'A 4.50',
        classEstLapTime: 88.5,
      });
    });

    it('returns the estimated lap time for a known driver', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/refresh.json');
      await refreshDriverInfo();

      expect(getClassEstLapTime(5)).toBe(88.5);
    });
  });

  it('returns the car indices in the player class', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/drivers/car-indices.json');

    expect(await getPlayerClassCarIdx()).toEqual([1, 2, 3]);
  });

  it('builds driver data from a complete telemetry fixture', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/head2head/race.json');

    const filtered = await getFilteredRawDrivers();
    await refreshDriverInfo();

    for (const raw of filtered) {
      expect(getDriverInfo(raw.CarIdx)).toMatchObject({
        carIdx: raw.CarIdx,
        name: raw.UserName,
      });
    }
  });
});
