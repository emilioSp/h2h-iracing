// Formats delta values when rendering head-to-head cards.

export const formatDelta = (d: number | null): string => {
  if (d === null) return 'N/A';
  const sign = d > 0 ? '+' : d < 0 ? '-' : '';
  const abs = Math.abs(d);

  return `${sign}${abs.toFixed(2).padStart(3, '0')}s`;
};
