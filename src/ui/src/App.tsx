import { useEffect, useState } from 'react';
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
      <div className="grid place-items-center w-[800px] h-[480px] bg-black font-mono text-3xl text-[#444] uppercase tracking-[4px]">
        Waiting for session…
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[120px_240px_120px] w-[800px] h-[480px] bg-black text-white">
      {/* Ahead */}
      <div>
        {h2h.ahead ? (
          <CarCard car={h2h.ahead} variant="ahead" />
        ) : (
          <div className="grid place-items-center h-full font-mono text-3xl text-[#444] uppercase tracking-[4px]">
            Race leader
          </div>
        )}
      </div>

      {/* Player */}
      <div className="border border-[#3a3a6a]">
        <CarCard
          car={h2h.player}
          variant="player"
          gapAhead={h2h.gapAhead}
          deltaAhead={h2h.deltaAhead}
          gapBehind={h2h.gapBehind}
          deltaBehind={h2h.deltaBehind}
        />
      </div>

      {/* Behind */}
      <div>
        {h2h.behind ? (
          <CarCard car={h2h.behind} variant="behind" />
        ) : (
          <div className="grid place-items-center h-full font-mono text-3xl text-[#444] uppercase tracking-[4px]">
            Last place
          </div>
        )}
      </div>
    </div>
  );
};
