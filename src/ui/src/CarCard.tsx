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
      <div className="flex h-full">
        <div className="flex items-center justify-center w-20 border-r border-[#2a2a2a]">
          <span className="font-mono text-4xl font-bold text-[#aaa]">
            P{car.position}
          </span>
        </div>
        <div className="flex items-center flex-1 px-4 border-r border-[#2a2a2a]">
          <span className="font-sans text-3xl font-semibold text-white truncate">
            {formatName(car.driver.name)}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center w-20 border-r border-[#2a2a2a]">
          <span className="font-mono text-xl font-bold text-white">
            {car.driver.iRating}
          </span>
          <Label>iRTG</Label>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 border-r border-[#2a2a2a]">
          <span className="font-mono text-2xl font-bold text-white">
            {formatTime(car.lastLapTime)}
          </span>
          <Label>Last</Label>
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="font-mono text-2xl font-bold text-[#facc15]">
            {formatTime(car.bestLapTime)}
          </span>
          <Label>Best</Label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex items-center justify-center w-14 border-r border-[#2a2a2a]">
        <span className="font-mono text-lg font-bold text-[#888]">
          P{car.position}
        </span>
      </div>
      <div className="flex items-center flex-1 px-3 border-r border-[#2a2a2a]">
        <span className="font-sans text-base font-semibold text-white truncate">
          {formatName(car.driver.name)}
        </span>
      </div>
      <div className="flex flex-col items-center justify-center w-16 border-r border-[#2a2a2a]">
        <span className="font-mono text-sm font-bold text-white">
          {car.driver.iRating}
        </span>
        <Label>iRTG</Label>
      </div>
      <div className="flex flex-col items-center justify-center w-[170px] border-r border-[#2a2a2a]">
        <span className="font-mono text-base font-bold text-white">
          {formatTime(car.lastLapTime)}
        </span>
        <Label>Last</Label>
      </div>
      <div className="flex flex-col items-center justify-center w-[170px]">
        <span className="font-mono text-base font-bold text-[#facc15]">
          {formatTime(car.bestLapTime)}
        </span>
        <Label>Best</Label>
      </div>
    </div>
  );
};
