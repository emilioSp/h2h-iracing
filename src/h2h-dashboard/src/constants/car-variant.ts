// Defines car card roles when the head-to-head dashboard arranges its cards.
export const carVariant = {
  AHEAD: 'ahead',
  BEHIND: 'behind',
  PLAYER: 'player',
} as const;

export type CarVariant = (typeof carVariant)[keyof typeof carVariant];
