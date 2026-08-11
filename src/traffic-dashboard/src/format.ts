const LICENSE_COLOR_BY_CLASS: Record<string, string> = {
  PRO: '#FFFFFF',
  WC: '#FFFFFF',
  P: '#FFFFFF',
  A: '#006EFF',
  B: '#33CC00',
  C: '#FFCC00',
  D: '#FF6600',
  R: '#E1251B',
};

export const DEFAULT_LICENSE_COLOR = '#888888';

// license example: "A 4.16". The class, then the safety rating.
export const licenseColor = (license: string): string =>
  LICENSE_COLOR_BY_CLASS[license.split(' ')[0]?.toUpperCase() ?? ''] ??
  DEFAULT_LICENSE_COLOR;
