// Formats gap values when rendering head-to-head cards.
import { gapUnit } from '#common/constants/gap-unit.ts';
import { formatTime } from '#h2h-dashboard/utils/format-time.ts';
import type { Gap } from '#schema/head2head.schema.ts';

export const formatGap = (gap: Gap | null): string => {
  if (gap === null) return 'N/A';

  if (gap.unit === gapUnit.LAPS) return `${gap.value}L`;

  if (!Number.isFinite(gap.value)) return 'N/A';

  if (gap.value > 60) {
    return formatTime(gap.value);
  }

  return `${gap.value.toFixed(1)}s`;
};
