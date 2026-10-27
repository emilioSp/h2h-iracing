// Verifies fuel sample storage and consumption during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import fuelRepository from '#repository/fuel.repository.ts';

beforeEach(() => {
  fuelRepository.resetFuelTracking();
});

describe('getMedianFuelPerLap', () => {
  it('given one fuel sample has no consumption delta when median consumption is requested then the median is null', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });

    expect(fuelRepository.getMedianFuelPerLap()).toBeNull();
  });

  it('given four valid fuel deltas are recorded when median consumption is requested then their median is returned', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 1, fuelLevel: 48 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 2, fuelLevel: 46 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 3, fuelLevel: 44 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 4, fuelLevel: 41 });

    expect(fuelRepository.getMedianFuelPerLap()).toBe(2);
  });

  it('given fuel increases during a pit stop when median consumption is requested then the refuel delta is excluded', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 1, fuelLevel: 48 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 2, fuelLevel: 100 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 3, fuelLevel: 98 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 4, fuelLevel: 96 });

    expect(fuelRepository.getMedianFuelPerLap()).toBe(2);
  });

  it('given one lap consumes much more fuel when median consumption is requested then the median absorbs the outlier', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 1, fuelLevel: 48 }); // delta 2
    fuelRepository.updateFuelTracking({ playerLapCompleted: 2, fuelLevel: 46 }); // delta 2
    fuelRepository.updateFuelTracking({ playerLapCompleted: 3, fuelLevel: 44 }); // delta 2
    fuelRepository.updateFuelTracking({ playerLapCompleted: 4, fuelLevel: 42 }); // delta 2
    fuelRepository.updateFuelTracking({ playerLapCompleted: 5, fuelLevel: 32 }); // delta 10 (outlier)

    expect(fuelRepository.getMedianFuelPerLap()).toBe(2);
  });
});

describe('getFuelSamples', () => {
  it('given two lap starts are recorded when fuel samples are requested then both samples are returned', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 1, fuelLevel: 48 });

    expect(fuelRepository.getFuelSamples()).toEqual([
      { lapNumber: 0, fuelAtLapStart: 50 },
      { lapNumber: 1, fuelAtLapStart: 48 },
    ]);
  });

  it('given fuel tracking is reset when fuel samples are requested then recorded samples are cleared', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });

    fuelRepository.resetFuelTracking();

    expect(fuelRepository.getFuelSamples()).toEqual([]);
  });
});

describe('getLastLapFuelDelta', () => {
  it('given one fuel sample has no consumption delta when last lap consumption is requested then the last delta is null', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });

    expect(fuelRepository.getLastLapFuelDelta()).toBeNull();
  });

  it('given three lap starts are recorded when last lap consumption is requested then the latest consumption is returned', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 1, fuelLevel: 48 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 2, fuelLevel: 45 });

    expect(fuelRepository.getLastLapFuelDelta()).toBe(3);
  });

  it('given fuel increases on the latest lap when last lap consumption is requested then the last delta is null', () => {
    fuelRepository.updateFuelTracking({ playerLapCompleted: 0, fuelLevel: 50 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 1, fuelLevel: 48 });
    fuelRepository.updateFuelTracking({ playerLapCompleted: 2, fuelLevel: 100 });

    expect(fuelRepository.getLastLapFuelDelta()).toBeNull();
  });
});
