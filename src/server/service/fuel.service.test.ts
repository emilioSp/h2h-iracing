import { describe, expect, it } from 'vitest';
import {
  computeEstimatedDurationRaceEnd,
  computeFuelRefill,
  getOverallLeaderCarIdx,
} from '#service/fuel.service.ts';

describe('getOverallLeaderCarIdx', () => {
  it('returns index of car with position 1', () => {
    expect(getOverallLeaderCarIdx([0, 0, 1, 2])).toBe(2);
  });
  it('returns null when no car has position 1', () => {
    expect(getOverallLeaderCarIdx([0, 2, 3])).toBeNull();
  });
});

describe('computeEstimatedDurationRaceEnd', () => {
  it('leader at distPct=0: rounds partial lap up to the next S/F crossing', () => {
    // timeRemaining=120, lapTime=60, distPct=0 → timeToNextSF=60, timeAtNextSF=60
    // fullLaps=ceil(60/60)=1 → 60 + 60 = 120
    expect(computeEstimatedDurationRaceEnd(120, 60, 0)).toBeCloseTo(180);
  });

  it('timeRemaining=0 (timer already expired): race ends at next S/F', () => {
    // distPct=0.5 → timeToNextSF=30, timeAtNextSF=-30 ≤ 0 → 30
    expect(computeEstimatedDurationRaceEnd(0, 60, 0.5)).toBeCloseTo(30);
  });

  it('timeRemaining < timeToNextSF: race ends at current crossing', () => {
    // distPct=0 → timeToNextSF=60, timeAtNextSF=30-60=-30 ≤ 0 → 60
    expect(computeEstimatedDurationRaceEnd(30, 60, 0)).toBeCloseTo(60);
  });

  it('leader mid-lap with multiple laps remaining', () => {
    // timeRemaining=1140, lapTime=105, distPct=0.5
    // timeToNextSF=52.5, timeAtNextSF=1087.5, fullLaps=ceil(1087.5/105)=11
    // → 52.5 + 11*105 = 1207.5
    expect(computeEstimatedDurationRaceEnd(1140, 105, 0.5)).toBeCloseTo(1192.5);
  });
});

describe('computeFuelRefill', () => {
  it('clamps to 0 when tank has enough fuel', () => {
    const result = computeFuelRefill(10, 2, 3);
    expect(result.fuelRefillNoMarginLap).toBe(0);
    expect(result.fuelRefillForHalfMarginLap).toBe(0);
    expect(result.fuelRefillFor1MarginLap).toBe(0);
  });

  it('ordering: noMargin ≤ halfMargin ≤ 1Margin', () => {
    const result = computeFuelRefill(0, 2, 10);
    expect(result.fuelRefillNoMarginLap as number).toBeLessThanOrEqual(
      result.fuelRefillForHalfMarginLap as number,
    );
    expect(result.fuelRefillForHalfMarginLap as number).toBeLessThanOrEqual(
      result.fuelRefillFor1MarginLap as number,
    );
  });

  it('returns fractional fuel amount without rounding', () => {
    // 3 laps * 2.3 l/lap = 6.9, tank=0 → 6.9
    const result = computeFuelRefill(0, 2.3, 3);
    expect(result.fuelRefillNoMarginLap).toBeCloseTo(6.9);
  });
});
