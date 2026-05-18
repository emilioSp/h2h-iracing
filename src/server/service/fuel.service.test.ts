import { describe, expect, it } from 'vitest';
import {
  computeEstimatedTimeRemaining,
  computeFuelRefill,
} from '#service/fuel.service.ts';

describe('computeEstimatedTimeRemaining', () => {
  const noFlag = 0;
  const checkeredFlag = 0x00000001;

  it('leader at distPct=0: rounds partial lap up to the next S/F crossing', () => {
    expect(
      computeEstimatedTimeRemaining({
        timeRemaining: 120,
        flags: noFlag,
        leaderMedianLapTime: 60,
        playerMedianLapTime: 60,
        leaderLapDistPct: 0,
      }),
    ).toBeCloseTo(180);
  });

  it('timeRemaining=0 (timer already expired): race ends at next S/F', () => {
    expect(
      computeEstimatedTimeRemaining({
        timeRemaining: 0,
        flags: noFlag,
        leaderMedianLapTime: 60,
        playerMedianLapTime: 60,
        leaderLapDistPct: 0.5,
      }),
    ).toBeCloseTo(30);
  });

  it('timeRemaining < timeToNextSF: race ends at current crossing', () => {
    expect(
      computeEstimatedTimeRemaining({
        timeRemaining: 30,
        flags: noFlag,
        leaderMedianLapTime: 60,
        playerMedianLapTime: 60,
        leaderLapDistPct: 0,
      }),
    ).toBeCloseTo(60);
  });

  it('leader mid-lap with multiple laps remaining', () => {
    expect(
      computeEstimatedTimeRemaining({
        timeRemaining: 1140,
        flags: noFlag,
        leaderMedianLapTime: 105,
        playerMedianLapTime: 105,
        leaderLapDistPct: 0.5,
      }),
    ).toBeCloseTo(1207.5);
  });

  it('checkered flag: returns 0 regardless of time remaining', () => {
    expect(
      computeEstimatedTimeRemaining({
        timeRemaining: 600,
        flags: checkeredFlag,
        leaderMedianLapTime: 60,
        playerMedianLapTime: 60,
        leaderLapDistPct: 0.5,
      }),
    ).toBe(0);
  });

  it('null lap times: returns null', () => {
    expect(
      computeEstimatedTimeRemaining({
        timeRemaining: 600,
        flags: noFlag,
        leaderMedianLapTime: null,
        playerMedianLapTime: null,
        leaderLapDistPct: 0.5,
      }),
    ).toBeNull();
  });
});

describe('computeFuelRefill', () => {
  it('clamps to 0 when tank has enough fuel', () => {
    const result = computeFuelRefill({
      fuelLevel: 10,
      medianFuelPerLap: 2,
      lapsRemaining: 3,
    });
    expect(result.fuelRefillNoMarginLap).toBe(0);
    expect(result.fuelRefillForHalfMarginLap).toBe(0);
    expect(result.fuelRefillFor1MarginLap).toBe(0);
  });

  it('ordering: noMargin ≤ halfMargin ≤ 1Margin', () => {
    const result = computeFuelRefill({
      fuelLevel: 0,
      medianFuelPerLap: 2,
      lapsRemaining: 10,
    });
    expect(result.fuelRefillNoMarginLap as number).toBeLessThanOrEqual(
      result.fuelRefillForHalfMarginLap as number,
    );
    expect(result.fuelRefillForHalfMarginLap as number).toBeLessThanOrEqual(
      result.fuelRefillFor1MarginLap as number,
    );
  });

  it('returns fractional fuel amount without rounding', () => {
    // 3 laps * 2.3 l/lap = 6.9, tank=0 → 6.9
    const result = computeFuelRefill({
      fuelLevel: 0,
      medianFuelPerLap: 2.3,
      lapsRemaining: 3,
    });
    expect(result.fuelRefillNoMarginLap).toBeCloseTo(6.9);
  });
});
