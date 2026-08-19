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
  it('returns the SDK lap time when it is positive', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/car.json');

    expect(await computeLastLapTime(7)).toBe(85.5);
  });

  it('uses the session lap time when the SDK value is 0', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/car-service/session-times.json',
    );
    await refreshCurrentSessionInfo();

    expect(await computeLastLapTime(1)).toBe(86.2);
  });

  it('returns NaN when there is no time', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/no-times.json');
    await refreshCurrentSessionInfo();

    expect(await computeLastLapTime(1)).toBeNaN();
  });
});

describe('computeBestLapTime', () => {
  it('returns the SDK best time when it is positive', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/car.json');

    expect(await computeBestLapTime(7)).toBe(84.1);
  });

  it('uses the session best time when the SDK value is 0', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/car-service/session-times.json',
    );
    await refreshCurrentSessionInfo();

    expect(await computeBestLapTime(1)).toBe(83.9);
  });

  it('returns NaN when both sources have no time', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/car-service/no-times.json');
    await refreshCurrentSessionInfo();

    expect(await computeBestLapTime(1)).toBeNaN();
  });
});

describe('computeCar', () => {
  const standings: Standing[] = [{ carIdx: 7, pos: 3 }];

  const loadCarFixture = async (path: string): Promise<void> => {
    loadTelemetryFixture(path);
    await refreshDriverInfo();
    await refreshCurrentSessionInfo();
  };

  it('assembles a car from telemetry data', async () => {
    await loadCarFixture('fixture/telemetry-mock/car-service/car.json');

    const car = await computeCar({ carIdx: 7, standings });

    expect(car).toEqual({
      driver: expect.objectContaining({ name: 'Test Driver' }),
      position: 3,
      lastLapTime: 85.5,
      bestLapTime: 84.1,
      lap: 10,
    });
  });

  it('uses position 0 when the car is not in the standings', async () => {
    await loadCarFixture('fixture/telemetry-mock/car-service/car.json');

    const car = await computeCar({ carIdx: 99, standings });

    expect(car.position).toBe(0);
  });
});
