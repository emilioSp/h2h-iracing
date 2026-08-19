import { describe, expect, it } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { computeSpotter } from '#server/dashboard/spotter.dashboard.ts';

describe('computeSpotter', () => {
  it('When iRacing reports a clear track then both bars are empty', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/clear.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('When iRacing reports the spotter is off then both bars are empty', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/off.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('When iRacing reports a car on the left then only the left bar shows its overlap', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/left.json');
    await refreshDriverInfo();

    const spotter = await computeSpotter();

    expect(spotter).toEqual({
      left: {
        overlapStartPct: expect.closeTo(100 / 4.8, 5),
        overlapEndPct: 100,
      },
      right: null,
      isThreeWide: false,
    });
  });

  it('When iRacing reports a car on the right then only the right bar shows an overlap', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/right.json');
    await refreshDriverInfo();

    const spotter = await computeSpotter();

    expect(spotter.left).toBeNull();
    expect(spotter.right).not.toBeNull();
  });

  it('When iRacing reports two cars on the left then the dashboard reports three wide', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/two-left.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('When iRacing reports two cars on the right then the dashboard reports three wide', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/two-right.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('When iRacing reports cars on both sides then the dashboard reports three wide', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/three-wide.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('When iRacing reports a car on the left but no overlap then the left bar has no coloured segment', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/no-overlap.json');
    await refreshDriverInfo();

    const spotter = await computeSpotter();

    // Equal start and end values produce a visible bar with no coloured segment.
    expect(spotter.left).toEqual({ overlapStartPct: 100, overlapEndPct: 100 });
  });
});
