export const formatTime = (s: number): string => {
  if (s <= 0 || !Number.isFinite(s)) return '--:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

export const formatGap = (s: number): string => {
  if (!Number.isFinite(s)) return 'N/A';
  const sec = Math.floor(s);
  const ms = Math.round((s % 1) * 1000);
  const twoDecimal = `${sec}.${String(ms).padStart(3, '0')}`.slice(0, -1);
  return `${twoDecimal}s`;
};

export const formatDelta = (d: number): string => {
  if (!Number.isFinite(d)) return 'N/A';
  const sign = d > 0 ? '+' : d < 0 ? '-' : '';
  const abs = Math.abs(d);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);
  const twoDecimal = `${sec}.${String(ms).padStart(3, '0')}`.slice(0, -1);
  return `${sign}${twoDecimal}s`;
};

export const formatName = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length < 2) return name;
  const initial = parts[0].charAt(0).toUpperCase();
  const surname = parts[parts.length - 1];
  return `${initial}. ${surname}`;
};

export const deltaClass = (d: number): string => {
  if (!Number.isFinite(d)) return 'neutral';
  return d < 0 ? 'gaining' : 'losing';
};
