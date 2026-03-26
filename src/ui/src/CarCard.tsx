import {
  deltaClass,
  formatDelta,
  formatGap,
  formatName,
  formatTime,
} from './format.js';
import type { Car } from './types.js';

type Props =
  | { car: Car; variant: 'ahead' | 'behind' }
  | {
      car: Car;
      variant: 'player';
      gapAhead: number;
      deltaAhead: number;
      gapBehind: number;
      deltaBehind: number;
    };

const Label = ({ children }: { children: string }) => (
  <span className="text-[12px] text-[#555] uppercase tracking-widest leading-none">
    {children}
  </span>
);

const deltaColors: Record<string, string> = {
  gaining: 'text-[#00e676]',
  losing: 'text-[#ff1744]',
  neutral: 'text-[#555]',
};

const IdentityRow = ({ car }: { car: Car }) => (
  <div className="grid grid-cols-[80px_1fr_1fr] border-b border-[#2a2a2a]">
    <div className="grid place-items-center border-[#2a2a2a]">
      <span className="font-mono text-3xl font-bold text-[#aaa]">
        P{car.position}
      </span>
    </div>
    <div className="grid items-center px-4 border-[#2a2a2a] min-w-0">
      <span className="font-mono text-3xl font-semibold text-white truncate">
        {formatName(car.driver.name)}
      </span>
    </div>
    <div className="grid items-center justify-items-end px-4 min-w-0">
      <span className="font-mono text-2xl text-[#888] truncate">
        {car.driver.car}
      </span>
    </div>
  </div>
);

const StatsRow = ({ car, border }: { car: Car; border?: boolean }) => (
  <div
    className={`grid grid-cols-4 ${border ? 'border-b border-[#2a2a2a]' : ''}`}
  >
    <div className="grid place-content-center justify-items-center border-[#2a2a2a]">
      <span className="font-mono text-3xl font-bold text-white">
        {car.driver.license}
      </span>
    </div>
    <div className="grid items-center border-[#2a2a2a]">
      <span className="font-mono items-center text-3xl font-bold text-white">
        {car.driver.iRating}
      </span>
    </div>
    <div className="grid place-content-center justify-items-center border-[#2a2a2a]">
      <span className="font-mono text-3xl font-bold text-white">
        {formatTime(car.lastLapTime)}
      </span>
      <Label>Last</Label>
    </div>
    <div className="grid place-content-center justify-items-center">
      <span className="font-mono text-3xl font-bold text-[#facc15]">
        {formatTime(car.bestLapTime)}
      </span>
      <Label>Best</Label>
    </div>
  </div>
);

const GapDeltaRow = ({
  gap,
  delta,
  border,
}: {
  gap: number;
  delta: number;
  border?: boolean;
}) => (
  <div
    className={`grid grid-cols-4 ${border ? 'border-b border-[#2a2a2a]' : ''}`}
  >
    <div />
    <div />
    <div className="grid place-content-center justify-items-center px-4 border-[#2a2a2a]">
      <span
        className={`font-mono text-3xl font-bold ${deltaColors[deltaClass(delta)]}`}
      >
        {formatDelta(delta)}
      </span>
      <Label>Delta</Label>
    </div>
    <div className="grid place-content-center justify-items-center px-4">
      <span className="font-mono text-3xl font-bold text-white">
        {formatGap(gap)}
      </span>
      <Label>Gap</Label>
    </div>
  </div>
);

export const CarCard = (props: Props) => {
  const { car } = props;

  if (props.variant === 'player') {
    const { gapAhead, deltaAhead, gapBehind, deltaBehind } = props;
    return (
      <div className="grid grid-rows-4 h-full">
        <GapDeltaRow gap={gapAhead} delta={deltaAhead} border />
        <IdentityRow car={car} />
        <StatsRow car={car} border />
        <GapDeltaRow gap={gapBehind} delta={deltaBehind} />
      </div>
    );
  }

  return (
    <div className="grid grid-rows-2 h-full">
      <IdentityRow car={car} />
      <StatsRow car={car} />
    </div>
  );
};
