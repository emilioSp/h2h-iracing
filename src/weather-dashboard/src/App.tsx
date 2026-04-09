import {
  Clock,
  CloudRain,
  Droplets,
  Flag,
  Road,
  Sun,
  Waves,
  Wind,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WelcomePage } from '../../common/WelcomePage.js';
import { CompassRose } from './CompassRose.js';
import type { WeatherData } from './types.js';
import './styles.css';

const COMPASS_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const compassIndex = (deg: number) =>
  Math.round((((deg % 360) + 360) % 360) / 45) % 8;

const formatSessionTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const formatLocalTime = (date: Date): string =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

type MetricChipProps = {
  value: string;
  icon: React.ReactNode;
};

const MetricChip = ({ value, icon }: MetricChipProps) => (
  <div className="grid justify-items-center content-center gap-2 border-r border-border last:border-r-0 h-full">
    <div className="text-green">{icon}</div>
    <span className="text-2xl font-bold text-white font-mono">{value}</span>
  </div>
);

export const App = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [localTime, setLocalTime] = useState(() => new Date());
  const localTimerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    localTimerRef.current = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(localTimerRef.current);
  }, []);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource('/sse/weather');
      es.onmessage = (e) => {
        const parsed = JSON.parse(e.data) as { data: WeatherData };
        setWeather(parsed.data);
      };
      es.onerror = () => {
        es.close();
        setWeather(null);
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

  if (!weather) return <WelcomePage subtitle="Weather" />;

  const kmh = (weather.windVelocityMs * 3.6).toFixed(1);
  const windLabel = COMPASS_LABELS[compassIndex(weather.windDirectionDeg)];

  return (
    <div className="grid grid-rows-[100px_1fr] w-200 h-120 bg-bg text-white font-mono">
      {/* Metric chips row */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_2fr] border-b border-border">
        <MetricChip
          icon={<Road size={28} />}
          value={`${weather.trackTemperatureC.toFixed(1)}°C`}
        />
        <MetricChip
          icon={<Sun size={28} />}
          value={`${weather.airTemperatureC.toFixed(1)}°C`}
        />
        <MetricChip
          icon={<Droplets size={28} />}
          value={`${weather.relativeHumidityPct}%`}
        />
        <MetricChip
          icon={<CloudRain size={28} />}
          value={`${weather.precipitationPct}%`}
        />
        <MetricChip icon={<Waves size={28} />} value={weather.trackWetness} />
      </div>

      {/* Compass area */}
      <div className="grid grid-cols-2 items-center justify-items-center h-full">
        <CompassRose
          windRelativeDeg={weather.windRelativeDirectionDeg}
          size={360}
        />

        <div className="grid justify-items-center gap-2 border border-border rounded-xl p-8">
          <Wind size={50} className="text-green" />
          <span className="text-5xl font-bold font-mono tracking-widest uppercase">
            {windLabel}
          </span>
          <span className="text-5xl font-mono font-bold text-white text-dim">
            {kmh} km/h
          </span>
          <div className="w-full border-t border-border my-2" />
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 w-full">
            <Flag size={28} className="text-green" />
            <span className="text-2xl font-mono font-bold text-right">
              {formatSessionTime(weather.sessionSecondsAfterMidnight)}
            </span>
            <Clock size={28} className="text-green" />
            <span className="text-2xl font-mono font-bold text-right">
              {formatLocalTime(localTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
