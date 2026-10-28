// Renders driver and lap information when a head-to-head car card is displayed.
import { useEffect, useRef, useState } from 'react';

import { carVariant, type CarVariant } from '#h2h-dashboard/constants/car-variant.ts';
import { deltaState } from '#h2h-dashboard/constants/delta-state.ts';
import { deltaClass } from '#h2h-dashboard/utils/delta-class.ts';
import { formatDelta } from '#h2h-dashboard/utils/format-delta.ts';
import { formatGap } from '#h2h-dashboard/utils/format-gap.ts';
import { formatName } from '#h2h-dashboard/utils/format-name.ts';
import { formatTime } from '#h2h-dashboard/utils/format-time.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Gap } from '#schema/head2head.schema.ts';

type Props =
  | { car: Car; variant: Exclude<CarVariant, typeof carVariant.PLAYER> }
  | {
      car: Car;
      variant: typeof carVariant.PLAYER;
      gapAhead: Gap | null;
      deltaAhead: number | null;
      gapBehind: Gap | null;
      deltaBehind: number | null;
    };

type LabelProps = { children: string };

const Label = ({ children }: LabelProps) => (
  <span className="text-[13px] text-dim uppercase tracking-widest leading-none">{children}</span>
);

const deltaColors = {
  [deltaState.GAINING]: 'text-green',
  [deltaState.LOSING]: 'text-red',
  [deltaState.NEUTRAL]: 'text-dim',
} as const;

type DriverInfoGridProps = { car: Car };

const DriverInfoGrid = ({ car }: DriverInfoGridProps) => {
  const [bestHighlighted, setBestHighlighted] = useState(false);
  const [lastHighlighted, setLastHighlighted] = useState(false);
  const prevBestRef = useRef(0);
  const prevLastRef = useRef(0);

  useEffect(() => {
    if (car.bestLapTime !== prevBestRef.current && car.bestLapTime !== null) {
      prevBestRef.current = car.bestLapTime;
      setBestHighlighted(true);
      const timer = setTimeout(() => setBestHighlighted(false), 8000);

      return () => clearTimeout(timer);
    }
  }, [car.bestLapTime]);

  useEffect(() => {
    if (car.lastLapTime !== prevLastRef.current && car.lastLapTime !== null) {
      prevLastRef.current = car.lastLapTime;
      setLastHighlighted(true);
      const timer = setTimeout(() => setLastHighlighted(false), 8000);

      return () => clearTimeout(timer);
    }
  }, [car.lastLapTime]);

  return (
    <div className="grid grid-cols-[80px_1fr_1fr_2fr_2fr] grid-rows-2 h-full">
      <div className="col-span-3 grid items-center min-w-0 pl-6">
        <span className="font-mono text-3xl font-semibold text-white truncate">
          {formatName(car.driver.name)}
        </span>
      </div>
      <div className="row-span-2 grid place-content-center justify-items-center">
        <span
          className={`font-mono text-4xl font-bold ${bestHighlighted ? 'text-yellow animate-pulse' : 'text-white'}`}
        >
          {formatTime(car.bestLapTime)}
        </span>
        <Label>Best</Label>
      </div>
      <div className="row-span-2 grid place-content-center justify-items-center">
        <span
          className={`font-mono text-4xl font-bold ${lastHighlighted ? 'text-yellow animate-pulse' : 'text-white'}`}
        >
          {formatTime(car.lastLapTime)}
        </span>
        <Label>Last</Label>
      </div>
      <div className="grid place-items-center">
        <span className="font-mono text-3xl font-bold text-white">P{car.position}</span>
      </div>
      <div className="grid place-items-center">
        <span className="font-mono text-3xl font-bold text-white">{car.driver.license}</span>
      </div>
      <div className="grid items-center justify-items-end">
        <span className="font-mono text-3xl font-bold text-white pr-1.5">{car.driver.iRating}</span>
      </div>
    </div>
  );
};

type GapDeltaRowProps = { gap: Gap | null; delta: number | null };

const GapDeltaRow = ({ gap, delta }: GapDeltaRowProps) => {
  const [deltaHighlighted, setDeltaHighlighted] = useState(false);
  const prevDeltaRef = useRef(0);

  useEffect(() => {
    if (delta !== prevDeltaRef.current && delta !== null) {
      prevDeltaRef.current = delta;
      setDeltaHighlighted(true);
      const timer = setTimeout(() => setDeltaHighlighted(false), 8000);

      return () => clearTimeout(timer);
    }
  }, [delta]);

  return (
    <div className="grid grid-cols-[1fr_1fr_2fr_2fr]">
      <div />
      <div />
      <div className="grid items-center justify-items-end">
        <span
          className={`font-mono text-4xl font-bold ${gap === null ? 'text-dim' : 'text-yellow'}`}
        >
          {formatGap(gap)}
        </span>
        <Label>Gap</Label>
      </div>
      <div className="grid place-content-center justify-items-center">
        <span
          className={`font-mono text-4xl font-bold ${deltaColors[deltaClass(delta)]}${deltaHighlighted ? ' animate-pulse' : ''}`}
        >
          {formatDelta(delta)}
        </span>
        <Label>Delta lap</Label>
      </div>
    </div>
  );
};

export const CarCard = (props: Props) => {
  const { car } = props;

  if (props.variant === carVariant.PLAYER) {
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
