import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as driverRepository from '#repository/driver.repository.ts';
import * as iracingRepository from '#repository/irsdk.repository.ts';
import { carLeftRight } from '#schema/spotter.schema.ts';
import { computeSpotter } from '#server/dashboard/spotter.dashboard.ts';

const TRACK_LENGTH_METERS = 5000;

// Player is car 4 at half distance, car 2 is 1 m ahead, car 7 is far away.
const lapDistPct = [0, 0, 0.5002, 0, 0.5, 0, 0, 0.8];

let getCarsIdx: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubEnv('DATA_MODE', 'live');
  vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(4);
  vi.spyOn(iracingRepository, 'getLapDistPct').mockResolvedValue(lapDistPct);
  vi.spyOn(iracingRepository, 'getOnPitRoad').mockResolvedValue(
    Array(8).fill(0),
  );
  vi.spyOn(iracingRepository, 'getTrackLengthMeters').mockResolvedValue(
    TRACK_LENGTH_METERS,
  );
  getCarsIdx = vi
    .spyOn(driverRepository, 'getCarsIdx')
    .mockResolvedValue([2, 4, 7]);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('computeSpotter', () => {
  it('reports nothing when the track is clear', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CLEAR,
    );

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('reports nothing when the spotter is off', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.OFF,
    );

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('fills only the left bar when a car is on the left', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_LEFT,
    );

    const spotter = await computeSpotter();

    expect(spotter.right).toBeNull();
    expect(spotter.isThreeWide).toBe(false);
    expect(spotter.left?.overlapStartPct).toBeCloseTo(100 / 4.8, 5);
    expect(spotter.left?.overlapEndPct).toBe(100);
  });

  it('fills only the right bar when a car is on the right', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_RIGHT,
    );

    const spotter = await computeSpotter();

    expect(spotter.left).toBeNull();
    expect(spotter.right).not.toBeNull();
  });

  it('treats two cars on one side as that side', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.TWO_CARS_LEFT,
    );

    const spotter = await computeSpotter();

    expect(spotter.left).not.toBeNull();
    expect(spotter.right).toBeNull();
  });

  it('flags three wide without a per-side overlap when cars are on both sides', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_LEFT_AND_RIGHT,
    );

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: true,
    });
    expect(getCarsIdx).not.toHaveBeenCalled();
  });

  it('reports nothing when the player is alone on track', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_LEFT,
    );
    vi.spyOn(driverRepository, 'getCarsIdx').mockResolvedValue([4]);

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('shows an empty bar when the nearest car does not overlap', async () => {
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_LEFT,
    );
    vi.spyOn(driverRepository, 'getCarsIdx').mockResolvedValue([4, 7]);

    const spotter = await computeSpotter();

    expect(spotter.left).toEqual({ overlapStartPct: 100, overlapEndPct: 100 });
  });

  it('reports nothing when the player is not in a car', async () => {
    vi.spyOn(iracingRepository, 'getPlayerCarIdx').mockResolvedValue(-1);
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_LEFT,
    );

    expect(await computeSpotter()).toEqual({
      left: null,
      right: null,
      isThreeWide: false,
    });
  });

  it('pins the player to the mock car index in mock mode', async () => {
    vi.stubEnv('DATA_MODE', 'mock');
    vi.spyOn(iracingRepository, 'getCarLeftRight').mockResolvedValue(
      carLeftRight.CAR_RIGHT,
    );

    const spotter = await computeSpotter();

    // Player is car 2, so car 4 sits 1 m behind — segment starts at the tail.
    // Were the spied getPlayerCarIdx used, car 2 would be 1 m ahead instead.
    expect(spotter.right?.overlapStartPct).toBe(0);
    expect(spotter.right?.overlapEndPct).toBeCloseTo(100 - 100 / 4.8, 5);
  });
});
