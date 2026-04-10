import { describe, expect, it } from 'vitest';
import { formatTime } from './format.ts';

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
