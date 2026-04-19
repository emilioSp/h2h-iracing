import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FuelSample } from '#repository/fuel.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import { formatFuel, printFuel } from './fuel-cli.ts';

const makeFuel = (overrides: Partial<FuelRefill> = {}): FuelRefill => ({
  fuelLevel: 42.3,
  fuelLastLap: 3.12,
  medianFuelPerLap: 2.98,
  lapsRemaining: 8.43,
  fuelRefillNoMarginLap: 2.84,
  fuelRefillForHalfMarginLap: 4.33,
  fuelRefillFor1MarginLap: 5.82,
  estimatedTimeRemaining: 1525,
  lastLapNumber: 12,
  ...overrides,
});

describe('formatFuel', () => {
  it('formats null as --', () => {
    expect(formatFuel(null)).toBe('--');
  });

  it('formats a number with 2 decimal places and L unit', () => {
    expect(formatFuel(2.983)).toBe('2.98 L');
  });

  it('formats zero as 0.00 L', () => {
    expect(formatFuel(0)).toBe('0.00 L');
  });
});

describe('printFuel', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'clear').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prints waiting message when fuel is null', () => {
    printFuel(null, []);
    expect(console.clear).toHaveBeenCalledOnce();
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('Waiting'))).toBe(true);
  });

  it('prints fuel level', () => {
    printFuel(makeFuel(), []);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(
      lines.some((l) => l.includes('Fuel Level') && l.includes('42.30 L')),
    ).toBe(true);
  });

  it('prints laps remaining', () => {
    printFuel(makeFuel(), []);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(
      lines.some((l) => l.includes('Laps Remaining') && l.includes('8.43')),
    ).toBe(true);
  });

  it('prints internal state with fuel samples', () => {
    const samples: FuelSample[] = [
      { lapNumber: 10, fuelAtLapStart: 45.22 },
      { lapNumber: 11, fuelAtLapStart: 42.24 },
    ];
    printFuel(makeFuel(), samples);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('INTERNAL STATE'))).toBe(true);
    expect(lines.some((l) => l.includes('10') && l.includes('45.22'))).toBe(
      true,
    );
    expect(lines.some((l) => l.includes('11') && l.includes('42.24'))).toBe(
      true,
    );
  });

  it('prints empty samples message when no samples', () => {
    printFuel(makeFuel(), []);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('no samples yet'))).toBe(true);
  });
});
