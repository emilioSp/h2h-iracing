import { describe, expect, it } from 'vitest';
import {
  getDriverInfo,
  getFilteredRawDrivers,
  getPlayerClassCarIdx,
  refreshDriverInfo,
} from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';

describe('driver repository', () => {
  describe('getFilteredRawDrivers', () => {
    it('When iRacing reports two drivers in the player class and one in another class then it excludes the other class', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/same-class.json');

      const drivers = await getFilteredRawDrivers();
      const names = drivers.map((driver) => driver.UserName);

      expect(names).toEqual(['Player', 'Same Class']);
      expect(names).not.toContain('Other Class');
    });

    it('When iRacing reports a driver with car index minus one then it excludes that driver', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/invalid-index.json');

      const drivers = await getFilteredRawDrivers();
      const names = drivers.map((driver) => driver.UserName);

      expect(names).not.toContain('Slot Zero');
    });

    it('When iRacing reports a pace car then it excludes the pace car', async () => {
      loadTelemetryFixture('fixture/telemetry-mock/drivers/pace-car.json');

      const drivers = await getFilteredRawDrivers();
      const names = drivers.map((driver) => driver.UserName);

      expect(names).not.toContain('Pace Car');
    });
  });

  it('When iRacing reports complete driver data then refresh stores the mapped driver', async () => {
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

  it('When iRacing reports three cars in the player class then it returns their indices', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/drivers/car-indices.json');

    expect(await getPlayerClassCarIdx()).toEqual([1, 2, 3]);
  });
});
