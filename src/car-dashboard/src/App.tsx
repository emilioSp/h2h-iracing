import { Banana, Gauge, ShieldCog, Snail } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CarTelemetry } from '#schema/car-telemetry.schema.ts';
import { WelcomePage } from '../../common/WelcomePage.js';
import './styles.css';

type CellColor = 'red' | 'blue' | 'yellow';

type MetricCellProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: CellColor;
  activeBg?: boolean;
  blink?: boolean;
};

const borderColorClass: Record<CellColor, string> = {
  red: 'border-red',
  blue: 'border-blue',
  yellow: 'border-yellow',
};

const bgColorClass: Record<CellColor, string> = {
  red: 'bg-[rgba(255,23,68,0.20)]',
  blue: 'bg-[rgba(68,138,255,0.25)]',
  yellow: 'bg-[rgba(250,204,21,0.20)]',
};

const textColorClass: Record<CellColor, string> = {
  red: 'text-red',
  blue: 'text-blue',
  yellow: 'text-yellow',
};

const MetricCell = ({
  label,
  value,
  icon,
  color,
  activeBg = false,
  blink = false,
}: MetricCellProps) => (
  <div
    className={`grid place-items-center p-6 border border-border ${
      activeBg && color
        ? `${borderColorClass[color]} ${bgColorClass[color]} ${blink ? 'animate-pulse [animation-duration:0.8s]' : ''}`
        : 'bg-bg'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={color ? textColorClass[color] : 'text-white'}>{icon}</div>
      <span
        className={`text-4xl font-mono font-bold uppercase tracking-[4px] ${color ? textColorClass[color] : 'text-white'}`}
      >
        {label}
      </span>
    </div>
    <span
      className={`text-5xl font-mono font-black ${color ? textColorClass[color] : 'text-white'}`}
    >
      {value}
    </span>
  </div>
);

export const App = () => {
  const [car, setCar] = useState<CarTelemetry | null>(null);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse/car');
      es.onmessage = (e) => {
        const parsed = JSON.parse(e.data) as { data: CarTelemetry };
        setCar(parsed.data);
      };
      es.onerror = (error) => {
        console.log('error', error);
        console.log('Connection lost, retrying in 10 seconds...');
        es.close();
        setCar(null);
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

  if (!car) return <WelcomePage subtitle="Car Telemetry" />;

  return (
    <div className="grid grid-cols-2 grid-rows-2 w-200 h-120 bg-bg text-white font-mono">
      <MetricCell
        label="ABS"
        value={String(car.abs)}
        icon={<ShieldCog size={56} />}
        color="red"
        activeBg={car.isAbsActive}
      />
      <MetricCell
        label="TC"
        value={String(car.tc)}
        icon={<Banana size={56} />}
        color="blue"
        activeBg={car.isTcActive}
      />
      <MetricCell
        label="BB"
        value={`${car.brakeBias.toFixed(1)}%`}
        icon={<Gauge size={56} />}
      />
      <MetricCell
        label="PIT"
        value={car.isPitSpeedLimiterActive ? 'ON' : 'OFF'}
        icon={<Snail size={56} />}
        color="yellow"
        activeBg={car.isPitSpeedLimiterActive}
        blink={car.isPitSpeedLimiterActive}
      />
    </div>
  );
};
