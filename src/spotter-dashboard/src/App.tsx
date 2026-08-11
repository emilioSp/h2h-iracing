import { useEffect, useState } from 'react';
import type { Spotter, SpotterSide } from '#schema/spotter.schema.ts';
import { WelcomePage } from '../../common/WelcomePage.js';
import './styles.css';

type BarProps = {
  side: SpotterSide | null;
  isThreeWide: boolean;
};

const segmentOf = ({ side, isThreeWide }: BarProps) => {
  if (isThreeWide) return { bottomPct: 0, heightPct: 100 };
  if (!side) return { bottomPct: 0, heightPct: 0 };
  return {
    bottomPct: side.overlapStartPct,
    heightPct: side.overlapEndPct - side.overlapStartPct,
  };
};

const Bar = ({ side, isThreeWide }: BarProps) => {
  const { bottomPct, heightPct } = segmentOf({ side, isThreeWide });

  return (
    <div className="relative w-full h-full rounded-full bg-black/80 border border-white/10">
      {heightPct > 0 && (
        <div
          className={`absolute inset-x-0 rounded-full ${
            isThreeWide ? 'animate-three-wide' : 'bg-yellow'
          }`}
          style={{ bottom: `${bottomPct}%`, height: `${heightPct}%` }}
        />
      )}
    </div>
  );
};

export const App = () => {
  const [spotter, setSpotter] = useState<Spotter | null>(null);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse/spotter');
      es.onmessage = (e) => {
        const parsed = JSON.parse(e.data) as { data: Spotter };
        setSpotter(parsed.data);
      };
      es.onerror = (error) => {
        console.log('error', error);
        console.log('Connection lost, retrying in 10 seconds...');
        es.close();
        setSpotter(null);
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

  // WelcomePage is a fixed 800x480 panel. Scale it to the 200px height of this
  // overlay and centre the resulting 333px width by hand: the transform does
  // not change the layout box, so the parent cannot centre it for us.
  if (!spotter)
    return (
      <div className="relative h-50 w-200">
        <div className="absolute top-0 left-[233px] origin-top-left scale-[0.4167]">
          <WelcomePage subtitle="Spotter" />
        </div>
      </div>
    );

  if (!spotter.left && !spotter.right && !spotter.isThreeWide) return null;

  return (
    <div className="grid grid-cols-[24px_1fr_24px] w-200 h-50 px-6 py-4">
      <Bar side={spotter.left} isThreeWide={spotter.isThreeWide} />
      <div />
      <Bar side={spotter.right} isThreeWide={spotter.isThreeWide} />
    </div>
  );
};
