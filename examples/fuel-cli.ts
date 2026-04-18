import { setTimeout } from 'node:timers/promises';
import config from '#config';
import { computeFuel } from '#dashboard/fuel.dashboard.ts';
import {
  type FuelSample,
  getFuelSamples,
} from '#repository/fuel.repository.ts';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import { tick } from '#server/tick.ts';

const formatTime = (s: number): string => {
  if (s <= 0 || !Number.isFinite(s)) return '--:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

const W = 64;
const LINE = '═'.repeat(W);

const pad = (s: string, len = W) => s.padEnd(len);

const row = (label: string, value: string) =>
  console.log(`║    ${pad(`${label}${value}`, W - 2)}║`);

export const formatFuel = (n: number | null): string =>
  n === null ? '--' : `${n.toFixed(2)} L`;

export const printFuel = (
  fuel: FuelRefill | null,
  samples: readonly FuelSample[],
): void => {
  console.clear();

  if (!fuel) {
    console.log('Waiting for session…');
    return;
  }

  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('FUEL CALCULATOR', W)}║`);
  console.log(`╠${LINE}╣`);
  row('Fuel Level    : ', formatFuel(fuel.fuelLevel));
  row('Last Lap      : ', formatFuel(fuel.fuelLastLap));
  row('Median/Lap    : ', formatFuel(fuel.medianFuelPerLap));
  row(
    'Laps Remaining: ',
    fuel.lapsRemaining === null ? '--' : String(fuel.lapsRemaining),
  );
  row('Refill (±0)   : ', formatFuel(fuel.fuelRefillNoMarginLap));
  row('Refill (+0.5) : ', formatFuel(fuel.fuelRefillForHalfMarginLap));
  row('Refill (+1)   : ', formatFuel(fuel.fuelRefillFor1MarginLap));
  row(
    'Race End ETA  : ',
    fuel.estimatedDurationRaceEnd === null
      ? '--'
      : formatTime(fuel.estimatedDurationRaceEnd),
  );
  row('Last Lap #    : ', String(fuel.lastLapNumber));
  console.log(`╠${LINE}╣`);
  console.log(
    `║  ${pad(`INTERNAL STATE — fuel samples (window=${samples.length})`, W)}║`,
  );
  console.log(`╠${LINE}╣`);

  if (samples.length === 0) {
    console.log(`║    ${pad('no samples yet', W - 2)}║`);
  } else {
    row('Lap  Fuel at Lap Start  Delta', '');
    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const prev = samples[i - 1];
      const delta =
        prev !== undefined
          ? ` (${(prev.fuelAtLapStart - s.fuelAtLapStart).toFixed(2)})`
          : '';
      row(
        `  ${String(s.lapNumber).padStart(3)}  `,
        `${s.fuelAtLapStart.toFixed(2)} L${delta}`,
      );
    }
  }

  console.log(`╚${LINE}╝`);
};

while (true) {
  if (!(await isIRacingConnected())) {
    continue;
  }
  await tick();
  const fuel = await computeFuel();
  const samples = getFuelSamples();

  printFuel(fuel, samples);

  if (config.DATA_MODE === 'mock') break;
  await setTimeout(config.POLL_INTERVAL_MS);
}
