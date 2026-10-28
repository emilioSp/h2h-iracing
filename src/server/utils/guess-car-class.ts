// Derives a traffic class label from the car model name when rendering approaching traffic.
import { carClass, type CarClass } from '#common/constants/car-class.ts';

type CarClassPattern = {
  className: CarClass;
  pattern: RegExp;
};

// PCUP comes first: iRacing names some Cup cars "Porsche 911 GT3 Cup", which
// the GT3 pattern would claim. "Porsche 911 GT3 R" has no "Cup" and still
// resolves to GT3.
const CAR_CLASS_PATTERNS: CarClassPattern[] = [
  { className: carClass.PCUP, pattern: /\bCup\b/i },
  { className: carClass.GT3, pattern: /\bGT3\b/i },
  { className: carClass.GT4, pattern: /\bGT4\b/i },
  { className: carClass.F3, pattern: /\bF3\b/i },
  { className: carClass.GTE, pattern: /\bGTE\b/i },
  { className: carClass.GT1, pattern: /\bGT1\b/i },
  { className: carClass.LMP2, pattern: /\bLMP2\b/i },
];

export const guessCarClass = (car: string): CarClass =>
  CAR_CLASS_PATTERNS.find(({ pattern }) => pattern.test(car))?.className ?? carClass.GTP;
