import { describe, expect, it } from 'vitest';
import { refreshDriverInfo } from '#repository/driver.repository.ts';
import { loadTelemetryFixture } from '#repository/irsdk.repository.ts';
import { computeSpotter } from '#server/dashboard/spotter.dashboard.ts';

describe('computeSpotter', () => {
  it('reports nothing when the track is clear', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/clear.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('reports nothing when the spotter is off', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/off.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('fills only the left bar when a car is on the left', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/left.json');
    await refreshDriverInfo();

    const spotter = await computeSpotter();

    expect(spotter.right).toBeNull();
    expect(spotter.isThreeWide).toBe(false);
    expect(spotter.left?.overlapStartPct).toBeCloseTo(100 / 4.8, 5);
    expect(spotter.left?.overlapEndPct).toBe(100);
  });

  it('fills only the right bar when a car is on the right', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/right.json');
    await refreshDriverInfo();

    const spotter = await computeSpotter();

    expect(spotter.left).toBeNull();
    expect(spotter.right).not.toBeNull();
  });

  it('reports three wide when two cars are on the left', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/two-left.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('reports three wide when two cars are on the right', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/two-right.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('reports three wide when cars are on both sides', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/three-wide.json');

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
  });

  it('shows an empty left bar when iRacing reports a car left but no car overlaps', async () => {
    loadTelemetryFixture('fixture/telemetry-mock/spotter/no-overlap.json');
    await refreshDriverInfo();

    const spotter = await computeSpotter();

    // Equal start and end values produce a visible bar with no coloured segment.
    expect(spotter.left).toEqual({ overlapStartPct: 100, overlapEndPct: 100 });
  });
});
