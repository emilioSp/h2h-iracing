import { describe, expect, it } from 'vitest';
import { formatGap, formatTime } from './format.ts';

describe('formatTime', () => {
  it('formats a normal lap time', () => {
    expect(formatTime(65.432)).toBe('01:05.432');
  });

  it('does not overflow to 4-digit milliseconds', () => {
    expect(formatTime(100.9997)).toBe('01:40.999');
  });

  it('returns placeholder for zero', () => {
    expect(formatTime(0)).toBe('--:--.---');
  });

  it('returns placeholder for negative', () => {
    expect(formatTime(-1)).toBe('--:--.---');
  });

  it('returns placeholder for Infinity', () => {
    expect(formatTime(Infinity)).toBe('--:--.---');
  });

  it('returns placeholder for NaN', () => {
    expect(formatTime(NaN)).toBe('--:--.---');
  });
});

describe('formatGap', () => {
  it('returns N/A for null', () => {
    expect(formatGap(null)).toBe('N/A');
  });

  it('formats a lap gap', () => {
    expect(formatGap({ value: 2, unit: 'laps' })).toBe('2L');
  });

  it('formats a gap under 60s in tenths', () => {
    expect(formatGap({ value: 3.456, unit: 'seconds' })).toBe('3.5s');
  });

  it('formats a gap over 60s as a time string', () => {
    expect(formatGap({ value: 75.5, unit: 'seconds' })).toBe('01:15.500');
  });

  it('returns N/A for non-finite value', () => {
    expect(formatGap({ value: Infinity, unit: 'seconds' })).toBe('N/A');
  });
});
