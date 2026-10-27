// Selects the pace state when head-to-head cards color a lap-time delta.
import { deltaState, type DeltaState } from '#h2h-dashboard/constants/delta-state.ts';

export const deltaClass = (delta: number | null): DeltaState => {
  if (delta === null) return deltaState.NEUTRAL;

  return delta < 0 ? deltaState.GAINING : deltaState.LOSING;
};
