import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CarState } from '#schema/battle.schema.ts';
import { formatDelta, formatGap, formatTime, printBattle, printCar } from './cli.ts';

const makeCar = (position: number): CarState => ({
  driver: {
    carIdx: 1,
    name: 'John Doe',
    carNumber: '42',
    car: 'Mazda MX-5',
    iRating: 2500,
    license: 'A 4.00',
  },
  position,
  lastLapTime: 95.5,
  bestLapTime: 94.123,
  lap: 5,
});

describe('formatTime', () => {
  it('formats a lap time correctly', () => {
    expect(formatTime(94.567)).toBe('01:34.567');
  });

  it('formats zero seconds as --:--.---', () => {
    expect(formatTime(0)).toBe('--:--.---');
  });

  it('formats negative values as --:--.---', () => {
    expect(formatTime(-1)).toBe('--:--.---');
  });

  it('formats Infinity as --:--.---', () => {
    expect(formatTime(Infinity)).toBe('--:--.---');
  });

  it('formats times over a minute', () => {
    expect(formatTime(125.001)).toBe('02:05.001');
  });
});

describe('formatGap', () => {
  it('formats a positive gap with + sign', () => {
    expect(formatGap(2.567)).toBe('+2.567s');
  });

  it('formats a negative gap with - sign', () => {
    expect(formatGap(-1.234)).toBe('-1.234s');
  });

  it('formats zero as +0.000s', () => {
    expect(formatGap(0)).toBe('+0.000s');
  });

  it('formats Infinity as N/A', () => {
    expect(formatGap(Infinity)).toBe('N/A');
  });

  it('formats NaN as N/A', () => {
    expect(formatGap(NaN)).toBe('N/A');
  });
});

describe('formatDelta', () => {
  it('formats a positive delta with + sign', () => {
    expect(formatDelta(0.789)).toBe('+0.789s');
  });

  it('formats a negative delta with - sign', () => {
    expect(formatDelta(-0.456)).toBe('-0.456s');
  });

  it('formats zero without sign', () => {
    expect(formatDelta(0)).toBe('0.000s');
  });

  it('formats Infinity as N/A', () => {
    expect(formatDelta(Infinity)).toBe('N/A');
  });

  it('formats NaN as N/A', () => {
    expect(formatDelta(NaN)).toBe('N/A');
  });
});

describe('printCar', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prints "none" when car is null', () => {
    printCar('Player', null);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('Player: none'))).toBe(true);
  });

  it('prints driver name, car, iRating, and lap times', () => {
    printCar('Player', makeCar(3));
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('John Doe'))).toBe(true);
    expect(lines.some((l) => l.includes('Mazda MX-5'))).toBe(true);
    expect(lines.some((l) => l.includes('2500'))).toBe(true);
    expect(lines.some((l) => l.includes('01:34.123'))).toBe(true);
  });

  it('prints gap when provided', () => {
    printCar('Ahead', makeCar(2), -1.5);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('Gap') && l.includes('-1.500s'))).toBe(true);
  });

  it('prints delta when provided', () => {
    printCar('Ahead', makeCar(2), -1.5, -0.3);
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('Delta') && l.includes('-0.300s'))).toBe(true);
  });

  it('omits gap and delta when not provided', () => {
    printCar('Player', makeCar(3));
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('Gap'))).toBe(false);
    expect(lines.some((l) => l.includes('Delta'))).toBe(false);
  });
});

describe('printBattle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'clear').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('prints waiting message when state is null', () => {
    printBattle(null);
    expect(console.clear).toHaveBeenCalledOnce();
    expect(vi.mocked(console.log).mock.calls.flat().some((l) => l.includes('Waiting'))).toBe(true);
  });

  it('prints session time and player position', () => {
    printBattle({
      sessionTime: 1234,
      player: makeCar(3),
      ahead: null,
      behind: null,
      gapAhead: 0,
      gapBehind: 0,
      deltaAhead: 0,
      deltaBehind: 0,
    });
    const lines = vi.mocked(console.log).mock.calls.flat();
    expect(lines.some((l) => l.includes('20:34') && l.includes('P3'))).toBe(true);
  });
});
