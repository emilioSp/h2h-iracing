// Verifies reference lap selection during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import {
  addRecentLap,
  getRefLap,
  type ReferenceLap,
  resetReferenceLaps,
} from '#repository/reference-lap.repository.ts';

const commonLapData = {
  refPoints: new Map(),
  lastTrackedPct: 0.99,
  isOnPitRoad: false,
};

const lap1: ReferenceLap = {
  startTime: 0,
  finishTime: 45,
  ...commonLapData,
};

const lap2: ReferenceLap = {
  startTime: 50,
  finishTime: 99,
  ...commonLapData,
};

const lap3: ReferenceLap = {
  startTime: 99,
  finishTime: 150,
  ...commonLapData,
};

const lap4: ReferenceLap = {
  startTime: 150,
  finishTime: 200,
  ...commonLapData,
};

const lap5: ReferenceLap = {
  startTime: 200,
  finishTime: 248,
  ...commonLapData,
};

const lap6: ReferenceLap = {
  startTime: 248,
  finishTime: 300,
  ...commonLapData,
};

beforeEach(() => {
  resetReferenceLaps();
});

describe('getRefLap', () => {
  it('given no recent laps exist for a car when the reference lap is requested then its reference lap is null', () => {
    expect(getRefLap(0)).toBeNull();
  });

  it('given the recent window is not full when the reference lap is requested then its fastest lap is returned', () => {
    addRecentLap({ carIdx: 0, lap: lap1 });
    addRecentLap({ carIdx: 0, lap: lap2 });
    addRecentLap({ carIdx: 0, lap: lap3 });

    expect(getRefLap(0)).toBe(lap1);
  });

  it('given the recent window overflows when the reference lap is requested then the expired fastest lap is excluded', () => {
    addRecentLap({ carIdx: 0, lap: lap1 });
    addRecentLap({ carIdx: 0, lap: lap2 });
    addRecentLap({ carIdx: 0, lap: lap3 });
    addRecentLap({ carIdx: 0, lap: lap4 });
    addRecentLap({ carIdx: 0, lap: lap5 });
    addRecentLap({ carIdx: 0, lap: lap6 });

    expect(getRefLap(0)).toBe(lap5);
  });
});
