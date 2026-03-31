import { useEffect, useState } from 'react';
import { CarCard } from './CarCard.js';
import type { Head2Head } from './types.js';
import './styles.css';

const WelcomePage = () => (
  <div className="relative grid place-items-center w-200 h-120 bg-bg font-mono overflow-hidden">
    {/* Corner HUD brackets */}
    <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-border-player" />
    <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-border-player" />
    <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l border-border-player" />
    <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-border-player" />

    <div className="flex flex-col items-center gap-5">
      {/* H2H logo */}
      <div className="flex items-end leading-none">
        <span className="text-[110px] font-black text-white leading-none">
          H
        </span>
        <span className="text-[72px] font-black text-gaining leading-none pb-3 px-1">
          2
        </span>
        <span className="text-[110px] font-black text-white leading-none">
          H
        </span>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px w-20 bg-border-player" />
        <span className="text-3xl tracking-[7px] text-[#888] uppercase">
          Head to Head
        </span>
        <div className="h-px w-20 bg-border-player" />
      </div>

      <span className="text-3xl tracking-[12px] text-[#555] uppercase">
        iRacing Overlay
      </span>

      {/* Status */}
      <div className="flex items-center gap-3 mt-6">
        <div className={`w-3 h-3 rounded-full animate-pulse bg-losing`} />
        <span className="text-xl tracking-[4px] text-[#555] uppercase">
          Waiting for session
        </span>
      </div>
    </div>
  </div>
);

export const App = () => {
  const [h2h, setH2h] = useState<Head2Head | null>(null);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse');
      es.onmessage = (e) => {
        const parsed = JSON.parse(e.data) as { data: Head2Head };
        setH2h(parsed.data);
      };
      es.onerror = (error) => {
        console.log('error', error);
        console.log('Connection lost, retrying in 10 seconds...');
        es.close();
        setH2h(null);
        clearTimeout(retryTimeout);
        retryTimeout = setTimeout(connect, 10_000);
      };
    };

    connect();

    return () => {
      clearTimeout(retryTimeout);
      es?.close();
    };
  }, []);

  if (!h2h) {
    return <WelcomePage />;
  }

  return (
    <div className="grid grid-rows-[120px_240px_120px] w-200 h-120 bg-black text-white">
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
      <div className="border-y border-border-player">
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
