// Verifies dashboard formatting during regression tests.
import { describe, expect, it } from 'vitest';

import { formatGap, formatTime } from './format.ts';

describe('formatTime', () => {
  it('given a lap time of 65.432 seconds when formatted then it is 01:05.432', () => {
    expect(formatTime(65.432)).toBe('01:05.432');
  });

  it('given a lap time of 100.9997 seconds when formatted then milliseconds are truncated to three digits', () => {
    expect(formatTime(100.9997)).toBe('01:40.999');
  });

  it('given a zero lap time when formatted then a placeholder is returned', () => {
    expect(formatTime(0)).toBe('--:--.---');
  });

  it('given a negative lap time when formatted then a placeholder is returned', () => {
    expect(formatTime(-1)).toBe('--:--.---');
  });

  it('given an infinite lap time when formatted then a placeholder is returned', () => {
    expect(formatTime(Infinity)).toBe('--:--.---');
  });

  it('given a NaN lap time when formatted then a placeholder is returned', () => {
    expect(formatTime(NaN)).toBe('--:--.---');
  });
});

describe('formatGap', () => {
  it('given a null gap when formatted then N/A is returned', () => {
    expect(formatGap(null)).toBe('N/A');
  });

  it('given a two-lap gap when formatted then it is 2L', () => {
    expect(formatGap({ value: 2, unit: 'laps' })).toBe('2L');
  });

  it('given a gap under 60 seconds when formatted then it is rounded to tenths of a second', () => {
    expect(formatGap({ value: 3.456, unit: 'seconds' })).toBe('3.5s');
  });

  it('given a gap over 60 seconds when formatted then it is a time string', () => {
    expect(formatGap({ value: 75.5, unit: 'seconds' })).toBe('01:15.500');
  });

  it('given an infinite gap when formatted then N/A is returned', () => {
    expect(formatGap({ value: Infinity, unit: 'seconds' })).toBe('N/A');
  });
});
