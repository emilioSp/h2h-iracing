import {
  deltaClass,
  formatDelta,
  formatGap,
  formatName,
  formatTime,
} from './format.js';
import type { Car, Gap } from './types.js';

type Props =
  | { car: Car; variant: 'ahead' | 'behind' }
  | {
      car: Car;
      variant: 'player';
      gapAhead: Gap | null;
      deltaAhead: number;
      gapBehind: Gap | null;
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

const DriverInfoGrid = ({ car }: { car: Car }) => (
  <div className="grid grid-cols-[80px_1fr_1fr_2fr_2fr] grid-rows-2 h-full">
    <div className="col-span-3 grid items-center min-w-0 pl-[22px]">
      <span className="font-mono text-3xl font-semibold text-white truncate">
        {formatName(car.driver.name)}
      </span>
    </div>
    <div className="row-span-2 grid place-content-center justify-items-center">
      <span className="font-mono text-4xl font-bold text-white">
        {formatTime(car.bestLapTime)}
      </span>
      <Label>Best</Label>
    </div>
    <div className="row-span-2 grid place-content-center justify-items-center">
      <span className="font-mono text-4xl font-bold text-white">
        {formatTime(car.lastLapTime)}
      </span>
      <Label>Last</Label>
    </div>
    <div className="grid place-items-center">
      <span className="font-mono text-3xl font-bold text-[#aaa]">
        P{car.position}
      </span>
    </div>
    <div className="grid place-items-center">
      <span className="font-mono text-3xl font-bold text-white">
        {car.driver.license}
      </span>
    </div>
    <div className="grid items-center justify-items-end">
      <span className="font-mono text-3xl font-bold text-white pr-[5px]">
        {car.driver.iRating}
      </span>
    </div>
  </div>
);

const GapDeltaRow = ({ gap, delta }: { gap: Gap | null; delta: number }) => (
  <div className="grid grid-cols-[1fr_1fr_2fr_2fr]">
    <div />
    <div />
    <div className="grid items-center justify-items-end">
      <span className="font-mono text-4xl font-bold text-[#facc15]">
        {formatGap(gap)}
      </span>
      <Label>Gap {gap?.method ?? ''}</Label>
    </div>
    <div className="grid place-content-center justify-items-center">
      <span
        className={`font-mono text-4xl font-bold ${deltaColors[deltaClass(delta)]}`}
      >
        {formatDelta(delta)}
      </span>
      <Label>Delta</Label>
    </div>
  </div>
);

export const CarCard = (props: Props) => {
  const { car } = props;

  if (props.variant === 'player') {
    const { gapAhead, deltaAhead, gapBehind, deltaBehind } = props;
    return (
      <div className="grid grid-rows-[1fr_2fr_1fr] h-full py-2.5">
        <GapDeltaRow gap={gapAhead} delta={deltaAhead} />
        <DriverInfoGrid car={car} />
        <GapDeltaRow gap={gapBehind} delta={deltaBehind} />
      </div>
    );
  }

  return <DriverInfoGrid car={car} />;
};
