// Formats name values when rendering head-to-head cards.

export const formatName = (name: string): string => {
  const parts = name.trim().split(' ');

  return parts[parts.length - 1];
};
