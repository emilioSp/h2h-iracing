export const formatTime = (s: number): string => {
  if (s <= 0 || !Number.isFinite(s)) return '--:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

export const formatGap = (
  gap: { value: number; unit: 'seconds' | 'laps' } | null,
): string => {
  if (gap === null) return 'N/A';
  if (gap.unit === 'laps') return `${gap.value}L`;
  if (!Number.isFinite(gap.value)) return 'N/A';
  const sec = Math.floor(gap.value);
  const ms = Math.round((gap.value % 1) * 1000);
  const twoDecimal = `${sec}.${String(ms).padStart(3, '0')}`.slice(0, -1);
  return `${twoDecimal}s`;
};

export const formatDelta = (d: number | null): string => {
  if (d === null) return 'N/A';
  const sign = d > 0 ? '+' : d < 0 ? '-' : '';
  const abs = Math.abs(d);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);
  const twoDecimal = `${sec}.${String(ms).padStart(3, '0')}`.slice(0, -1);
  return `${sign}${twoDecimal}s`;
};

export const deltaClass = (d: number | null): string => {
  if (d === null) return 'neutral';
  return d < 0 ? 'gaining' : 'losing';
};

export const formatName = (name: string): string => {
  const parts = name.trim().split(' ');
  return parts[parts.length - 1];
};
