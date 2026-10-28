// Defines pace states when head-to-head cards color lap-time deltas.
export const deltaState = {
  GAINING: 'gaining',
  LOSING: 'losing',
  NEUTRAL: 'neutral',
} as const;

export type DeltaState = (typeof deltaState)[keyof typeof deltaState];
