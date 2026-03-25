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
      <div className="flex items-center justify-center w-[800px] h-[480px] bg-black font-mono text-lg text-[#444] uppercase tracking-[4px]">
        Waiting for session…
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[800px] h-[480px] bg-black text-white">
      {/* Ahead: car (60px) + battle (90px) = 150px */}
      <div className="flex flex-col flex-[0_0_150px] border-b border-[#333]">
        <div className="flex-[0_0_60px] border-b border-[#2a2a2a]">
          {h2h.ahead ? (
            <CarCard car={h2h.ahead} />
          ) : (
            <div className="flex items-center justify-center h-full font-mono text-sm text-[#444] uppercase tracking-[4px]">
              Race leader
            </div>
          )}
        </div>
        <div className="flex-1">
          <BattleRow gap={h2h.gapAhead} delta={h2h.deltaAhead} />
        </div>
      </div>

      {/* Player: 180px */}
      <div className="flex-[0_0_180px] bg-[#060612] border-b border-[#1e3a6e]">
        <CarCard car={h2h.player} variant="player" />
      </div>

      {/* Behind: battle (90px) + car (60px) = 150px */}
      <div className="flex flex-col flex-[0_0_150px]">
        <div className="flex-1 border-b border-[#2a2a2a]">
          <BattleRow gap={h2h.gapBehind} delta={h2h.deltaBehind} />
        </div>
        <div className="flex-[0_0_60px]">
          {h2h.behind ? (
            <CarCard car={h2h.behind} />
          ) : (
            <div className="flex items-center justify-center h-full font-mono text-sm text-[#444] uppercase tracking-[4px]">
              Last place
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
