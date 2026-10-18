// Verifies standings ordering during regression tests.
import { describe, expect, it } from 'vitest';

import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { getRaceStandings, getSessionStandings } from '#service/standings.service.ts';

describe('getRaceStandings', () => {
  it('given iRacing reports race lap counts and positions when race standings are requested then cars are sorted by total distance', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/race.json');

    expect(await getRaceStandings()).toEqual([
      { pos: 1, carIdx: 3 },
      { pos: 2, carIdx: 1 },
      { pos: 3, carIdx: 2 },
    ]);
  });
});

describe('getSessionStandings', () => {
  it('given iRacing reports class positions when session standings are requested then cars are returned in position order', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/session.json');

    expect(await getSessionStandings()).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 3 },
      { pos: 3, carIdx: 1 },
    ]);
  });

  it('given iRacing reports one car with class position zero when session standings are requested then that car is excluded', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/session-excludes-zero.json');

    expect(await getSessionStandings()).toEqual([
      { pos: 1, carIdx: 2 },
      { pos: 2, carIdx: 3 },
    ]);
  });

  it('given iRacing reports all class positions as zero when session standings are requested then no standings are returned', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/standings/session-empty.json');

    expect(await getSessionStandings()).toEqual([]);
  });
});
