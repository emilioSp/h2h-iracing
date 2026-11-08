// Defines session identifiers when backend logic and tests inspect the current session.
export const sessionType = {
  RACE: 'Race',
  PRACTICE: 'Practice',
  OPEN_QUALIFY: 'Open Qualify',
  LONE_QUALIFY: 'Lone Qualify',
} as const;

export type SessionType = (typeof sessionType)[keyof typeof sessionType];
