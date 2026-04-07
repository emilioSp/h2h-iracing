import { describe, expect, it } from 'vitest';
import {
  addRecentLap,
  getRefLap,
  type ReferenceLap,
  ROLLING_WINDOW_LAPS_SIZE,
} from '#repository/reference-lap.repository.ts';

const common = {
  refPoints: new Map(),
  lastTrackedPct: 0.99,
  isOnPitRoad: false,
};

const lap1: ReferenceLap = {
  startTime: 0,
  finishTime: 45,
  ...common,
};

const lap2: ReferenceLap = {
  startTime: 50,
  finishTime: 99,
  ...common,
};

const lap3: ReferenceLap = {
  startTime: 99,
  finishTime: 150,
  ...common,
};

const lap4: ReferenceLap = {
  startTime: 150,
  finishTime: 200,
  ...common,
};

const lap5: ReferenceLap = {
  startTime: 200,
  finishTime: 248,
  ...common,
};

const lap6: ReferenceLap = {
  startTime: 248,
  finishTime: 300,
  ...common,
};

describe('getRefLap', () => {
  it('returns 5 for the rolling window size', () => {
    expect(ROLLING_WINDOW_LAPS_SIZE).toBe(5);
  });

  it('returns null when no recent laps exist', () => {
    expect(getRefLap(0)).toBeNull();
  });

  it('returns the fastest lap in the rolling window even if the window is not full', () => {
    addRecentLap(0, lap1);
    addRecentLap(0, lap2);
    addRecentLap(0, lap3);
    expect(getRefLap(0)).toBe(lap1);
  });

  it('returns the fastest lap in the rolling window', () => {
    addRecentLap(0, lap1);
    addRecentLap(0, lap2);
    addRecentLap(0, lap3);
    addRecentLap(0, lap4);
    addRecentLap(0, lap5);
    expect(getRefLap(0)).toBe(lap1);
  });

  it('should not return lap1 even if it is the fastest (due to rolling window size)', () => {
    addRecentLap(0, lap1);
    addRecentLap(0, lap2);
    addRecentLap(0, lap3);
    addRecentLap(0, lap4);
    addRecentLap(0, lap5);
    addRecentLap(0, lap6);
    expect(getRefLap(0)).toBe(lap5);
  });
});
