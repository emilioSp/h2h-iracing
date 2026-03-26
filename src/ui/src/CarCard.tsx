import { formatName, formatTime } from './format.js';
import type { Car } from './types.js';

type Props = { car: Car; variant?: 'compact' | 'player' };

const Label = ({ children }: { children: string }) => (
  <span className="text-[10px] text-[#555] uppercase tracking-widest leading-none">
    {children}
  </span>
);

export const CarCard = ({ car, variant = 'compact' }: Props) => {
  if (variant === 'player') {
    return (
      <div className="grid grid-cols-[80px_1fr_80px_1fr_1fr] h-full">
        <div className="grid place-items-center border-r border-[#2a2a2a]">
          <span className="font-mono text-4xl font-bold text-[#aaa]">
            P{car.position}
          </span>
        </div>
        <div className="grid items-center px-4 border-r border-[#2a2a2a]">
          <span className="font-sans text-3xl font-semibold text-white truncate">
            {formatName(car.driver.name)}
          </span>
        </div>
        <div className="grid place-content-center justify-items-center border-r border-[#2a2a2a]">
          <span className="font-mono text-xl font-bold text-white">
            {car.driver.iRating}
          </span>
          <Label>iRTG</Label>
        </div>
        <div className="grid place-content-center justify-items-center border-r border-[#2a2a2a]">
          <span className="font-mono text-2xl font-bold text-white">
            {formatTime(car.lastLapTime)}
          </span>
          <Label>Last</Label>
        </div>
        <div className="grid place-content-center justify-items-center">
          <span className="font-mono text-2xl font-bold text-[#facc15]">
            {formatTime(car.bestLapTime)}
          </span>
          <Label>Best</Label>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[56px_1fr_64px_170px_170px] h-full">
      <div className="grid place-items-center border-r border-[#2a2a2a]">
        <span className="font-mono text-lg font-bold text-[#888]">
          P{car.position}
        </span>
      </div>
      <div className="grid items-center px-3 border-r border-[#2a2a2a]">
        <span className="font-sans text-base font-semibold text-white truncate">
          {formatName(car.driver.name)}
        </span>
      </div>
      <div className="grid place-content-center justify-items-center border-r border-[#2a2a2a]">
        <span className="font-mono text-sm font-bold text-white">
          {car.driver.iRating}
        </span>
        <Label>iRTG</Label>
      </div>
      <div className="grid place-content-center justify-items-center border-r border-[#2a2a2a]">
        <span className="font-mono text-base font-bold text-white">
          {formatTime(car.lastLapTime)}
        </span>
        <Label>Last</Label>
      </div>
      <div className="grid place-content-center justify-items-center">
        <span className="font-mono text-base font-bold text-[#facc15]">
          {formatTime(car.bestLapTime)}
        </span>
        <Label>Best</Label>
      </div>
    </div>
  );
};
