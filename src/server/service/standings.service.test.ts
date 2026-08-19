import { describe, expect, it } from 'vitest';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import {
  getRaceStandings,
  getSessionStandings,
} from '#service/standings.service.ts';

describe('getRaceStandings', () => {
  it('sorts cars by total distance and assigns positions', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/race.json');

    expect(await getRaceStandings()).toEqual([
      { pos: 1, carIdx: 3 },
      { pos: 2, carIdx: 1 },
      { pos: 3, carIdx: 2 },
    ]);
  });
});

describe('getSessionStandings', () => {
  it('maps class positions and sorts them', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/session.json');

    expect(await getSessionStandings()).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 3 },
      { pos: 3, carIdx: 1 },
    ]);
  });

  it('excludes cars with class position 0', async () => {
    loadTelemetryFixture(
      'fixture/telemetry-mock/standings/session-excludes-zero.json',
    );

    expect(await getSessionStandings()).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 3 },
    ]);
  });

  it('returns an empty array when all class positions are 0', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/session-empty.json');

    expect(await getSessionStandings()).toEqual([]);
  });
});
