import { CloudRain, Droplets, Road, Sun, Waves, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WelcomePage } from '../../common/WelcomePage.js';
import { CompassRose } from './CompassRose.js';
import type { WeatherData } from './types.js';
import './styles.css';

const COMPASS_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const compassIndex = (deg: number) =>
  Math.round((((deg % 360) + 360) % 360) / 45) % 8;

type MetricChipProps = {
  value: string;
  icon: React.ReactNode;
};

const MetricChip = ({ value, icon }: MetricChipProps) => (
  <div className="grid justify-items-center content-center gap-2 border-r border-border last:border-r-0 h-full">
    <div className="text-gaining">{icon}</div>
    <span className="text-2xl font-bold text-white font-mono">{value}</span>
  </div>
);

export const App = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

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
          value={`${Math.round(weather.relativeHumidityPct)}%`}
        />
        <MetricChip
          icon={<CloudRain size={28} />}
          value={`${Math.round(weather.precipitationPct)}%`}
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
          <Wind size={50} className="text-gaining" />
          <span className="text-5xl font-bold font-mono tracking-widest uppercase">
            {windLabel}
          </span>
          <span className="text-5xl font-mono font-bold text-white text-dim">
            {kmh} km/h
          </span>
        </div>
      </div>
    </div>
  );
};
