import { describe, expect, it } from 'vitest';
import {
  computeEstimatedTimeRemaining,
  computeFuelRefill,
} from '#service/fuel.service.ts';

describe('computeEstimatedTimeRemaining', () => {
  const noFlag = 0;
  const checkeredFlag = 0x00000001;

  it('When the leader is at the start line with time remaining then one final lap is added', () => {
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

  it('When the timer expired while the leader is mid-lap then the race ends at the next crossing', () => {
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

  it('When the timer expires before the next crossing then no extra lap is added', () => {
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

  it('When the leader is mid-lap with time for multiple laps then all remaining race time is returned', () => {
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

  it('When the checkered flag is shown then the remaining time is zero', () => {
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

  it('When lap times are unavailable then the remaining time is null', () => {
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
  it('When the tank has enough fuel then every refill value is clamped to zero', () => {
    const result = computeFuelRefill({
      fuelLevel: 10,
      medianFuelPerLap: 2,
      lapsRemaining: 3,
    });

    expect(result).toEqual({
      fuelRefillNoMarginLap: 0,
      fuelRefillForHalfMarginLap: 0,
      fuelRefillFor1MarginLap: 0,
    });
  });

  it('When the tank is empty then each safety margin adds its fuel allowance', () => {
    const result = computeFuelRefill({
      fuelLevel: 0,
      medianFuelPerLap: 2,
      lapsRemaining: 10,
    });

    expect(result).toEqual({
      fuelRefillNoMarginLap: 20,
      fuelRefillForHalfMarginLap: 21,
      fuelRefillFor1MarginLap: 22,
    });
  });

  it('When fuel consumption is fractional then the refill value is not rounded', () => {
    const result = computeFuelRefill({
      fuelLevel: 0,
      medianFuelPerLap: 2.3,
      lapsRemaining: 3,
    });

    expect(result.fuelRefillNoMarginLap).toBeCloseTo(6.9);
  });
});
