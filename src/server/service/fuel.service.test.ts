import { describe, expect, it } from 'vitest';
import {
  computeEstimatedTimeRemaining,
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

describe('computeEstimatedTimeRemaining', () => {
  const noFlag = 0;
  const whiteFlag = 0x0080;
  const checkeredFlag = 0x0100;

  it('leader at distPct=0: rounds partial lap up to the next S/F crossing', () => {
    expect(
      computeEstimatedTimeRemaining(120, noFlag, 60, 60, 0, 0.5),
    ).toBeCloseTo(180);
  });

  it('timeRemaining=0 (timer already expired): race ends at next S/F', () => {
    expect(
      computeEstimatedTimeRemaining(0, noFlag, 60, 60, 0.5, 0.5),
    ).toBeCloseTo(30);
  });

  it('timeRemaining < timeToNextSF: race ends at current crossing', () => {
    expect(
      computeEstimatedTimeRemaining(30, noFlag, 60, 60, 0, 0.5),
    ).toBeCloseTo(60);
  });

  it('leader mid-lap with multiple laps remaining', () => {
    expect(
      computeEstimatedTimeRemaining(1140, noFlag, 105, 105, 0.5, 0.5),
    ).toBeCloseTo(1207.5);
  });

  it('checkered flag: returns 0 regardless of time remaining', () => {
    expect(
      computeEstimatedTimeRemaining(600, checkeredFlag, 60, 60, 0.5, 0.5),
    ).toBe(0);
  });

  it('white flag: returns time for player to finish current lap', () => {
    expect(
      computeEstimatedTimeRemaining(600, whiteFlag, 60, 90, 0.5, 0.5),
    ).toBeCloseTo(45);
  });

  it('white flag with null playerMedianLapTime: returns 0', () => {
    expect(
      computeEstimatedTimeRemaining(600, whiteFlag, 60, null, 0.5, 0.5),
    ).toBe(0);
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
