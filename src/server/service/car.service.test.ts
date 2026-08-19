import { describe, expect, it } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { refreshCurrentSessionInfo } from '#repository/session-info.repository.ts';
import {
  computeBestLapTime,
  computeCar,
  computeLastLapTime,
} from '#service/car.service.ts';
import type { Standing } from '#service/standings.service.ts';

describe('computeLastLapTime', () => {
  it('When iRacing telemetry reports a positive lap time then it returns that time', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/car.json');

    expect(await computeLastLapTime(7)).toBe(85.5);
  });

  it('When iRacing telemetry reports zero then it returns the session lap time', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/car-service/session-times.json',
    );
    await refreshCurrentSessionInfo();

    expect(await computeLastLapTime(1)).toBe(86.2);
  });

  it('When iRacing reports no lap time in telemetry or session data then it returns NaN', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/no-times.json');
    await refreshCurrentSessionInfo();

    expect(await computeLastLapTime(1)).toBeNaN();
  });
});

describe('computeBestLapTime', () => {
  it('When iRacing telemetry reports a positive best time then it returns that time', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/car.json');

    expect(await computeBestLapTime(7)).toBe(84.1);
  });

  it('When iRacing telemetry reports zero then it returns the session best time', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/car-service/session-times.json',
    );
    await refreshCurrentSessionInfo();

    expect(await computeBestLapTime(1)).toBe(83.9);
  });

  it('When iRacing reports no best time in telemetry or session data then it returns NaN', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/no-times.json');
    await refreshCurrentSessionInfo();

    expect(await computeBestLapTime(1)).toBeNaN();
  });
});

describe('computeCar', () => {
  const standings: Standing[] = [{ carIdx: 7, pos: 3 }];

  it('When iRacing reports complete car data then it assembles the car', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/car.json');
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const car = await computeCar({ carIdx: 7, standings });

    expect(car).toEqual({
      driver: expect.objectContaining({ name: 'Test Driver' }),
      position: 3,
      lastLapTime: 85.5,
      bestLapTime: 84.1,
      lap: 10,
    });
  });

  it('When iRacing reports a valid car missing from the standings then its position is zero', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/car.json');
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();

    const car = await computeCar({ carIdx: 7, standings: [] });

    expect(car.position).toBe(0);
  });
});
