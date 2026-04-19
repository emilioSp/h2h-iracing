import { Activity, Clock, Fuel, Gauge, RotateCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import { WelcomePage } from '../../common/WelcomePage.js';
import './styles.css';

const fmt1 = (v: number | null) => (v == null ? '--.-' : v.toFixed(1));
const fmt2 = (v: number | null) => (v == null ? '--.--' : v.toFixed(2));

const fmtTime = (secs: number | null): string => {
  if (secs == null || secs < 0) return '--:--:--';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

type FuelConsumptionColor = 'red' | 'green' | 'white';

const lastLapColor = (
  last: number | null,
  median: number | null,
): FuelConsumptionColor => {
  if (last == null || median == null) return 'white';
  if (last > median * 1.05) return 'red';
  if (last < median * 0.95) return 'green';
  return 'white';
};

const FuelConsumptionValueColor: Record<FuelConsumptionColor, string> = {
  red: 'text-red',
  green: 'text-green',
  white: 'text-white',
};

const fuelConsumptionIconColor: Record<FuelConsumptionColor, string> = {
  red: 'text-red',
  green: 'text-green',
  white: 'text-white',
};

type FuelConsumptionCellProps = {
  label: string;
  value: string;
  unit?: string;
  color?: FuelConsumptionColor;
  icon: ReactNode;
  className?: string;
};

const FuelConsumptionCell = ({
  label,
  value,
  unit,
  color = 'white',
  icon,
}: FuelConsumptionCellProps) => (
  <div className={`grid place-items-center p-4 bg-card`}>
    <div className="flex items-center gap-2 mb-1.5">
      <span className={fuelConsumptionIconColor[color]}>{icon}</span>
      <span className="text-xl tracking-[3px] text-white uppercase">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span
        className={`text-5xl font-black leading-none tabular-nums ${FuelConsumptionValueColor[color]}`}
      >
        {value}
      </span>
      {unit && (
        <span className="text-xl tracking-[2px] text-white">{unit}</span>
      )}
    </div>
  </div>
);

type LapsCellProps = {
  done: number | null;
  remaining: number | null;
};

const LapsCell = ({ done, remaining }: LapsCellProps) => {
  const total =
    done != null && remaining != null
      ? done + parseFloat(remaining.toFixed(2))
      : null;

  return (
    <div className="grid place-items-center p-4 bg-card">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-white">
          <RotateCw size={22} />
        </span>
        <span className="text-xl tracking-[3px] text-white uppercase">
          Laps
        </span>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-black leading-none tabular-nums text-white">
          {done != null ? done : '--'}
        </span>
        <span className="text-3xl text-white mx-1.5 leading-[1.6]">/</span>
        <span className="text-3xl font-black leading-none tabular-nums text-white">
          {total != null ? total : '--'}
        </span>
      </div>
      <span className="text-xl tracking-[2px] text-white mt-1">
        {remaining != null
          ? `${remaining.toFixed(2)} remaining`
          : '-- remaining'}
      </span>
    </div>
  );
};

type RefillColor = 'red' | 'yellow' | 'green';

const refillClasses: Record<RefillColor, string> = {
  red: 'bg-red/12 border-red text-red',
  yellow: 'bg-yellow/12 border-yellow text-yellow',
  green: 'bg-green/12 border-green text-green',
};

type RefillCellProps = {
  label: string;
  sublabel: string;
  value: number | null;
  color: RefillColor;
};

const RefillCell = ({ label, sublabel, value, color }: RefillCellProps) => (
  <div
    className={`grid place-items-center p-5 h-full border ${refillClasses[color]}`}
  >
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xl tracking-[3px] uppercase">{label}</span>
    </div>
    <span className="text-base tracking-[2px] text-white mb-2.5">
      {sublabel}
    </span>
    <div className="flex items-baseline gap-1">
      <span className="text-5xl font-black leading-none tabular-nums">
        {fmt2(value)}
      </span>
      <span className="text-base tracking-[2px] text-white">L</span>
    </div>
  </div>
);

export const App = () => {
  const [fuel, setFuel] = useState<FuelRefill | null>(null);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse/fuel');
      es.onmessage = (e) => {
        const parsed = JSON.parse(e.data) as { data: FuelRefill };
        setFuel(parsed.data);
      };
      es.onerror = () => {
        es.close();
        setFuel(null);
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

  if (!fuel) return <WelcomePage subtitle="Fuel Calculator" />;

  return (
    <div className="grid grid-rows-[140px_1fr_1fr] w-200 h-120 bg-bg text-white font-mono">
      {/* Row 1: Fuel level + Time left */}
      <div className="grid grid-cols-[2fr_1fr] border-b border-border">
        <div className="grid place-items-center px-7 py-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Fuel size={22} className="text-white" />
            <span className="text-xl tracking-[3px] text-white uppercase">
              Fuel Level
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black leading-none tabular-nums">
              {fmt1(fuel.fuelLevel)}
            </span>
            <span className="text-xl tracking-[2px]">L</span>
          </div>
        </div>

        <div className="grid place-items-center px-5 py-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock size={22} className="text-white" />
            <span className="text-xl tracking-[3px] text-white uppercase">
              remaining
            </span>
          </div>
          <span className="text-4xl font-black tabular-nums tracking-[2px]">
            {fmtTime(fuel.timeRemaining)}
          </span>
        </div>
      </div>

      {/* Row 2: Last lap | Median | Laps */}
      <div className="grid grid-cols-3">
        <FuelConsumptionCell
          label="Last Lap"
          value={fmt2(fuel.fuelLastLap)}
          unit="L"
          icon={<Gauge size={22} />}
          color={lastLapColor(fuel.fuelLastLap, fuel.medianFuelPerLap)}
        />
        <FuelConsumptionCell
          label="Median / Lap"
          value={fmt2(fuel.medianFuelPerLap)}
          unit="L"
          icon={<Activity size={22} />}
        />
        <LapsCell done={fuel.lastLapNumber} remaining={fuel.lapsRemaining} />
      </div>

      {/* Row 3: Refill section */}
      <div className="grid grid-rows-[auto_1fr]">
        <div className="grid grid-cols-3">
          <RefillCell
            label="±0 Lap"
            sublabel="No margin"
            value={fuel.fuelRefillNoMarginLap}
            color="red"
          />
          <div className="border-x border-border">
            <RefillCell
              label="+0.5 Lap"
              sublabel="Half lap margin"
              value={fuel.fuelRefillForHalfMarginLap}
              color="yellow"
            />
          </div>
          <RefillCell
            label="+1 Lap"
            sublabel="Full lap margin"
            value={fuel.fuelRefillFor1MarginLap}
            color="green"
          />
        </div>
      </div>
    </div>
  );
};
