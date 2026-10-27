// Verifies driver data filtering and mapping during regression tests.
import { describe, expect, it } from 'vitest';

import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';

describe('driver repository', () => {
  describe('getFilteredRawDrivers', () => {
    it('given iRacing reports two drivers in the player class and one in another class when drivers are filtered then it excludes the other class', async () => {
      irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/drivers/same-class.json');

      const drivers = await driverRepository.getFilteredRawDrivers();
      const names = drivers.map((driver) => driver.UserName);

      expect(names).toEqual(['Player', 'Same Class']);
      expect(names).not.toContain('Other Class');
    });

    it('given iRacing reports a driver with car index minus one when drivers are filtered then it excludes that driver', async () => {
      irsdkRepository.loadTelemetryFixture(
        'tests/fixtures/telemetry-mock/drivers/invalid-index.json',
      );

      const drivers = await driverRepository.getFilteredRawDrivers();
      const names = drivers.map((driver) => driver.UserName);

      expect(names).not.toContain('Slot Zero');
    });

    it('given iRacing reports a pace car when drivers are filtered then it excludes the pace car', async () => {
      irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/drivers/pace-car.json');

      const drivers = await driverRepository.getFilteredRawDrivers();
      const names = drivers.map((driver) => driver.UserName);

      expect(names).not.toContain('Pace Car');
    });
  });

  it('given iRacing reports complete driver data when driver info is refreshed then the mapped driver is stored', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/drivers/refresh.json');
    await driverRepository.refreshDriverInfo();

    expect(driverRepository.getDriverInfo(5)).toEqual({
      carIdx: 5,
      name: 'Alice',
      carNumber: '42',
      car: 'GT3 Car',
      iRating: 3500,
      license: 'A 4.50',
      classEstLapTime: 88.5,
    });
  });

  it('given iRacing reports three cars in the player class when player class car indices are requested then their indices are returned', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/drivers/car-indices.json');

    expect(await driverRepository.getPlayerClassCarIdx()).toEqual([1, 2, 3]);
  });
});
