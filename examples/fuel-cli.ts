// Displays fuel calculations and samples when running the fuel monitoring CLI.
import { setTimeout } from 'node:timers/promises';

import { dataMode } from '#common/constants/data-mode.ts';
import { config } from '#config';
import { computeFuel } from '#dashboard/fuel.dashboard.ts';
import fuelRepository, { type FuelSample } from '#repository/fuel.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { FuelRefill } from '#schema/fuel.schema.ts';
import telemetryTick from '#server/tick.ts';

const formatTime = (s: number): string => {
  if (s <= 0 || !Number.isFinite(s)) return '--:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);

  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

const W = 64;

const LINE = '═'.repeat(W);

type RowInput = {
  label: string;
  value: string;
};

const row = ({ label, value }: RowInput) =>
  console.log(`║    ${`${label}${value}`.padEnd(W - 2)}║`);

const formatFuel = (n: number | null): string => (n === null ? '--' : `${n.toFixed(2)} L`);

type PrintFuelInput = {
  fuel: FuelRefill | null;
  samples: readonly FuelSample[];
};

const printFuel = ({ fuel, samples }: PrintFuelInput): void => {
  console.clear();

  if (!fuel) {
    console.log('Waiting for session…');

    return;
  }

  console.log(`╔${LINE}╗`);
  console.log(`║  ${'FUEL CALCULATOR'.padEnd(W)}║`);
  console.log(`╠${LINE}╣`);
  row({
    label: 'Fuel Level    : ',
    value: formatFuel(fuel.fuelLevel),
  });
  row({
    label: 'Last Lap      : ',
    value: formatFuel(fuel.fuelLastLap),
  });
  row({
    label: 'Median/Lap    : ',
    value: formatFuel(fuel.medianFuelPerLap),
  });
  row({
    label: 'Laps Remaining: ',
    value: fuel.lapsRemaining === null ? '--' : String(fuel.lapsRemaining),
  });
  row({
    label: 'Refill (±0)   : ',
    value: formatFuel(fuel.fuelRefillNoMarginLap),
  });
  row({
    label: 'Refill (+0.5) : ',
    value: formatFuel(fuel.fuelRefillForHalfMarginLap),
  });
  row({
    label: 'Refill (+1)   : ',
    value: formatFuel(fuel.fuelRefillFor1MarginLap),
  });
  row({
    label: 'Time Remaining: ',
    value: fuel.timeRemaining === null ? '--' : formatTime(fuel.timeRemaining),
  });
  row({
    label: 'Race End ETA  : ',
    value: fuel.estimatedTimeRemaining === null ? '--' : formatTime(fuel.estimatedTimeRemaining),
  });
  row({
    label: 'Last Lap #    : ',
    value: String(fuel.lastLapNumber),
  });
  console.log(`╠${LINE}╣`);
  console.log(`║  ${`INTERNAL STATE — fuel samples (window=${samples.length})`.padEnd(W)}║`);
  console.log(`╠${LINE}╣`);

  if (samples.length === 0) {
    console.log(`║    ${'no samples yet'.padEnd(W - 2)}║`);
  } else {
    row({
      label: 'Lap  Fuel at Lap Start  Delta',
      value: '',
    });

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      const prev = samples[i - 1];

      const delta =
        prev !== undefined ? ` (${(prev.fuelAtLapStart - s.fuelAtLapStart).toFixed(2)})` : '';

      row({
        label: `  ${String(s.lapNumber).padStart(3)}  `,
        value: `${s.fuelAtLapStart.toFixed(2)} L${delta}`,
      });
    }
  }

  console.log(`╚${LINE}╝`);
};

while (true) {
  await telemetryTick.tick();

  if (!(await irsdkRepository.isIRacingConnected())) {
    continue;
  }

  const fuel = await computeFuel();
  const samples = fuelRepository.getFuelSamples();
  printFuel({
    fuel: fuel,
    samples: samples,
  });

  if (config.DATA_MODE === dataMode.MOCK) break;
  await setTimeout(config.POLL_INTERVAL_MS);
}
