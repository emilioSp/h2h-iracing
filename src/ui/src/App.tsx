import { useEffect, useState } from 'react';
import { BattleRow } from './BattleRow.js';
import { CarCard } from './CarCard.js';
import type { Head2Head } from './types.js';
import './styles.css';

export const App = () => {
  const [h2h, setH2h] = useState<Head2Head | null>(null);

  useEffect(() => {
    const es = new EventSource('/sse');
    es.onmessage = (e) => {
      const parsed = JSON.parse(e.data) as { data: Head2Head };
      setH2h(parsed.data);
    };
    return () => es.close();
  }, []);

  if (!h2h) {
    return (
      <div className="flex items-center justify-center w-[800px] h-[480px] bg-[#0d0d0d] font-sans text-xl text-[#666] uppercase tracking-[3px]">
        Waiting for session…
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[800px] h-[480px] bg-[#0d0d0d] text-white">
      {/* Ahead */}
      <div className="flex flex-col justify-center flex-[0_0_150px] px-4 bg-[#161616] border-b border-[#2a2a2a]">
        {h2h.ahead ? (
          <CarCard car={h2h.ahead} />
        ) : (
          <span className="text-sm font-semibold text-[#888] uppercase tracking-[3px]">
            Race leader
          </span>
        )}
        <BattleRow gap={h2h.gapAhead} delta={h2h.deltaAhead} />
      </div>

      {/* Player */}
      <div className="flex flex-col justify-center flex-[0_0_180px] px-4 bg-[#1a1a2e] border-y border-[#3a3a6a]">
        <CarCard car={h2h.player} />
      </div>

      {/* Behind */}
      <div className="flex flex-col justify-center flex-[0_0_150px] px-4 bg-[#161616] border-t border-[#2a2a2a]">
        <BattleRow gap={h2h.gapBehind} delta={h2h.deltaBehind} />
        {h2h.behind ? (
          <CarCard car={h2h.behind} />
        ) : (
          <span className="text-sm font-semibold text-[#888] uppercase tracking-[3px]">
            Last place
          </span>
        )}
      </div>
    </div>
  );
};
