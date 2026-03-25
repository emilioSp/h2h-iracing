import { formatName, formatTime } from './format.js';
import type { Car } from './types.js';

type Props = { car: Car };

export const CarCard = ({ car }: Props) => (
  <div>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="font-mono text-xl font-bold text-[#888] min-w-[36px]">
        P{car.position}
      </span>
      <span className="text-lg font-semibold text-white flex-1 truncate">
        {formatName(car.driver.name)}
      </span>
      <span className="font-mono text-xs text-[#888] text-right">
        {car.driver.iRating}
      </span>
    </div>
    <div className="flex gap-5 font-mono text-sm text-[#888]">
      <span>
        <strong className="text-white">{formatTime(car.lastLapTime)}</strong>{' '}
        last
      </span>
      <span>
        <strong className="text-white">{formatTime(car.bestLapTime)}</strong>{' '}
        best
      </span>
    </div>
  </div>
);
