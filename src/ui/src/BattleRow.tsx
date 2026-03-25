import { deltaClass, formatDelta, formatGap } from './format.js';

const deltaColors: Record<string, string> = {
  gaining: 'text-[#00e676]',
  losing: 'text-[#ff1744]',
  neutral: 'text-[#666]',
};

type Props = { gap: number; delta: number };

export const BattleRow = ({ gap, delta }: Props) => (
  <div className="flex items-center gap-6 py-1">
    <span className="font-mono text-xs text-[#888] uppercase tracking-widest w-8">
      GAP
    </span>
    <span className="font-mono text-2xl font-bold text-white w-24">
      {formatGap(gap)}
    </span>
    <span className="font-mono text-xs text-[#888] uppercase tracking-widest w-4">
      Δ
    </span>
    <span
      className={`font-mono text-4xl font-bold ${deltaColors[deltaClass(delta)]}`}
    >
      {formatDelta(delta)}
    </span>
  </div>
);
