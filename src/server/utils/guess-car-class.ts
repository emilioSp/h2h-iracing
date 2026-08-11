type CarClassPattern = {
  className: string;
  pattern: RegExp;
};

// PCUP comes first: iRacing names some Cup cars "Porsche 911 GT3 Cup", which
// the GT3 pattern would claim. "Porsche 911 GT3 R" has no "Cup" and still
// resolves to GT3.
const CAR_CLASS_PATTERNS: CarClassPattern[] = [
  { className: 'PCUP', pattern: /\bCup\b/i },
  { className: 'GT3', pattern: /\bGT3\b/i },
  { className: 'GT4', pattern: /\bGT4\b/i },
  { className: 'F3', pattern: /\bF3\b/i },
  { className: 'GTE', pattern: /\bGTE\b/i },
  { className: 'GT1', pattern: /\bGT1\b/i },
  { className: 'LMP2', pattern: /\bLMP2\b/i },
];

const DEFAULT_CAR_CLASS = 'GTP';

const cache = new Map<string, string>();

export const guessCarClass = (car: string): string => {
  // biome-ignore lint/style/noNonNullAssertion: the key is in the cache
  if (cache.has(car)) return cache.get(car)!;

  const carClass =
    CAR_CLASS_PATTERNS.find((carClassPattern: CarClassPattern) =>
      carClassPattern.pattern.test(car),
    )?.className ?? DEFAULT_CAR_CLASS;

  cache.set(car, carClass);
  return carClass;
};
