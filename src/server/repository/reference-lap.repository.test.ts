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
  it('When no recent laps exist for a car then its reference lap is null', () => {
    expect(getRefLap(0)).toBeNull();
  });

  it('When the recent window is not full then its fastest lap is returned', () => {
    addRecentLap({ carIdx: 0, lap: lap1 });
    addRecentLap({ carIdx: 0, lap: lap2 });
    addRecentLap({ carIdx: 0, lap: lap3 });

    expect(getRefLap(0)).toBe(lap1);
  });

  it('When the recent window overflows then the expired fastest lap is excluded', () => {
    addRecentLap({ carIdx: 0, lap: lap1 });
    addRecentLap({ carIdx: 0, lap: lap2 });
    addRecentLap({ carIdx: 0, lap: lap3 });
    addRecentLap({ carIdx: 0, lap: lap4 });
    addRecentLap({ carIdx: 0, lap: lap5 });
    addRecentLap({ carIdx: 0, lap: lap6 });

    expect(getRefLap(0)).toBe(lap5);
  });
});
