import { deltaClass, formatDelta, formatGap } from './format.js';

const deltaColors: Record<string, string> = {
  gaining: 'text-[#00e676]',
  losing: 'text-[#ff1744]',
  neutral: 'text-[#555]',
};

type Props = { gap: number; delta: number };

export const BattleRow = ({ gap, delta }: Props) => (
  <div className="flex h-full">
    <div className="flex flex-col items-center justify-center flex-1 border-r border-[#2a2a2a]">
      <span className="font-mono text-5xl font-bold text-white leading-none">
        {formatGap(gap)}
      </span>
      <span className="text-[10px] text-[#555] uppercase tracking-widest mt-1">
        Gap
      </span>
    </div>
    <div className="flex flex-col items-center justify-center flex-1">
      <span
        className={`font-mono text-5xl font-bold leading-none ${deltaColors[deltaClass(delta)]}`}
      >
        {formatDelta(delta)}
      </span>
      <span className="text-[10px] text-[#555] uppercase tracking-widest mt-1">
        Delta
      </span>
    </div>
  </div>
);
