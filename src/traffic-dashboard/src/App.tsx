import { useEffect, useState } from 'react';
import { TRAFFIC_WINDOW_SECONDS } from '#common/constant.ts';
import type { Traffic, TrafficCar } from '#schema/traffic.schema.ts';
import { WelcomePage500x200 } from '../../common/WelcomePage500x200.js';
import { licenseColor } from './format.ts';
import './styles.css';

const OVERLAY_HEIGHT = 200;
const ROW_HEIGHT = 28;

const topOf = (gapSeconds: number): number =>
  (gapSeconds / TRAFFIC_WINDOW_SECONDS) * (OVERLAY_HEIGHT - ROW_HEIGHT);

const LicenseBadge = ({ car }: { car: TrafficCar }) => {
  const color = licenseColor(car.license);

  return (
    <span
      className="grid grid-flow-col items-center gap-1.5 justify-self-end rounded-full border px-2 text-xs"
      style={{ borderColor: color, backgroundColor: `${color}26` }}
    >
      <span className="font-bold" style={{ color }}>
        {car.license}
      </span>
      <span className="text-white/70">{car.iRating}</span>
    </span>
  );
};

type RowProps = {
  car: TrafficCar;
  zIndex: number;
};

const Row = ({ car, zIndex }: RowProps) => (
  <div
    className="absolute inset-x-3 grid h-7 grid-cols-[2.5rem_3rem_1fr_auto_2.75rem] items-center gap-2 rounded-full bg-black/85 px-3 font-mono text-sm text-white transition-[top] duration-300 ease-out"
    style={{ top: `${topOf(car.gapSeconds)}px`, zIndex }}
  >
    <span className="text-dim">{car.carNumber}</span>
    <span className="font-bold text-yellow">{car.className}</span>
    <span className="truncate">{car.driverName}</span>
    <LicenseBadge car={car} />
    <span className="text-right font-bold">{car.gapSeconds.toFixed(1)}</span>
  </div>
);

export const App = () => {
  const [traffic, setTraffic] = useState<Traffic | null>(null);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse/traffic');
      es.onmessage = (e) => {
        const parsed = JSON.parse(e.data) as { data: Traffic };
        setTraffic(parsed.data);
      };
      es.onerror = (error) => {
        console.log('error', error);
        console.log('Connection lost, retrying in 10 seconds...');
        es.close();
        setTraffic(null);
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

  if (!traffic) return <WelcomePage500x200 subtitle="Traffic" />;

  if (traffic.cars.length === 0) return null;

  return (
    <div className="relative h-full">
      {/* Cars arrive sorted nearest first, so the nearest row stacks on top. */}
      {traffic.cars.map((car, index) => (
        <Row key={car.carIdx} car={car} zIndex={traffic.cars.length - index} />
      ))}
    </div>
  );
};
