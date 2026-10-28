// Defines car class labels when traffic detection derives a class from a model name.
export const carClass = {
  PCUP: 'PCUP',
  GT3: 'GT3',
  GT4: 'GT4',
  F3: 'F3',
  GTE: 'GTE',
  GT1: 'GT1',
  LMP2: 'LMP2',
  GTP: 'GTP',
} as const;

export type CarClass = (typeof carClass)[keyof typeof carClass];
