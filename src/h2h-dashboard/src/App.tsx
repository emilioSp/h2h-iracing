import { useEffect, useState } from 'react';
import { WelcomePage } from '../../common/WelcomePage.js';
import { CarCard } from './CarCard.js';
import type { Head2Head } from './types.js';
import './styles.css';

export const App = () => {
  const [h2h, setH2h] = useState<Head2Head | null>(null);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse/h2h');
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
    return <WelcomePage subtitle="Head to Head" />;
  }

  return (
    <div className="grid grid-rows-[120px_240px_120px] w-200 h-120 bg-bg text-white">
      {/* Ahead */}
      <div className="bg-card">
        {h2h.ahead ? (
          <CarCard car={h2h.ahead} variant="ahead" />
        ) : (
          <div className="grid place-items-center h-full font-mono text-3xl text-dim uppercase tracking-[4px]">
            Race leader
          </div>
        )}
      </div>

      {/* Player */}
      <div className="border-y border-border-player bg-player-bg">
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
      <div className="bg-card">
        {h2h.behind ? (
          <CarCard car={h2h.behind} variant="behind" />
        ) : (
          <div className="grid place-items-center h-full font-mono text-3xl text-dim uppercase tracking-[4px]">
            Last place
          </div>
        )}
      </div>
    </div>
  );
};
