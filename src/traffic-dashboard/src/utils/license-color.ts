// Resolves license badge colors when rendering the traffic overlay.
const LICENSE_COLOR_BY_CLASS = {
  PRO: '#FFFFFF',
  WC: '#FFFFFF',
  P: '#FFFFFF',
  A: '#006EFF',
  B: '#33CC00',
  C: '#FFCC00',
  D: '#FF6600',
  R: '#E1251B',
} as const;

export const DEFAULT_LICENSE_COLOR = '#888888';

const isLicenseClass = (value: string): value is keyof typeof LICENSE_COLOR_BY_CLASS =>
  Object.hasOwn(LICENSE_COLOR_BY_CLASS, value);

// license example: "A 4.16". The class, then the safety rating.
export const licenseColor = (license: string): string => {
  const licenseClass = license.split(' ')[0]?.toUpperCase() ?? '';

  return isLicenseClass(licenseClass)
    ? LICENSE_COLOR_BY_CLASS[licenseClass]
    : DEFAULT_LICENSE_COLOR;
};
