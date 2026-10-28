// Verifies car data assembly during regression tests.
import { describe, expect, it } from 'vitest';

import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';
import { computeBestLapTime } from '#service/best-lap-time.service.ts';
import { computeCar } from '#service/car.service.ts';
import { computeLastLapTime } from '#service/last-lap-time.service.ts';
import type { Standing } from '#service/standings.service.ts';

describe('computeLastLapTime', () => {
  it('given iRacing telemetry reports a positive lap time when the last lap time is computed then it returns that time', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/car-service/car.json');

    expect(await computeLastLapTime(7)).toBe(85.5);
  });

  it('given iRacing telemetry reports zero when the last lap time is computed then it returns the session lap time', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/car-service/session-times.json',
    );
    await sessionInfoRepository.refreshCurrentSessionInfo();

    expect(await computeLastLapTime(1)).toBe(86.2);
  });

  it('given iRacing reports no lap time in telemetry or session data when the last lap time is computed then it returns NaN', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/car-service/no-times.json');
    await sessionInfoRepository.refreshCurrentSessionInfo();

    expect(await computeLastLapTime(1)).toBeNaN();
  });
});

describe('computeBestLapTime', () => {
  it('given iRacing telemetry reports a positive best time when the best lap time is computed then it returns that time', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/car-service/car.json');

    expect(await computeBestLapTime(7)).toBe(84.1);
  });

  it('given iRacing telemetry reports zero when the best lap time is computed then it returns the session best time', async () => {
    irsdkRepository.loadTelemetryFixture(
      'tests/fixtures/telemetry-mock/car-service/session-times.json',
    );
    await sessionInfoRepository.refreshCurrentSessionInfo();

    expect(await computeBestLapTime(1)).toBe(83.9);
  });

  it('given iRacing reports no best time in telemetry or session data when the best lap time is computed then it returns NaN', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/car-service/no-times.json');
    await sessionInfoRepository.refreshCurrentSessionInfo();

    expect(await computeBestLapTime(1)).toBeNaN();
  });
});

describe('computeCar', () => {
  const standings: Standing[] = [{ carIdx: 7, pos: 3 }];

  it('given iRacing reports complete car data when the car is assembled then it assembles the car', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/car-service/car.json');
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

    const car = await computeCar({ carIdx: 7, standings });

    expect(car).toEqual({
      driver: expect.objectContaining({ name: 'Test Driver' }),
      position: 3,
      lastLapTime: 85.5,
      bestLapTime: 84.1,
      lap: 10,
    });
  });

  it('given iRacing reports a valid car missing from the standings when the car is assembled then its position is zero', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/car-service/car.json');
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

    const car = await computeCar({ carIdx: 7, standings: [] });

    expect(car.position).toBe(0);
  });
});
