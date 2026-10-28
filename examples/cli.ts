// Displays dashboard telemetry in the terminal when running the general monitoring CLI.
import { setTimeout } from 'node:timers/promises';

import { COMPASS_LABELS } from '#common/constants/compass.ts';
import { dataMode } from '#common/constants/data-mode.ts';
import { gapUnit } from '#common/constants/gap-unit.ts';
import { config } from '#config';
import { computeHead2Head } from '#dashboard/head2head.dashboard.ts';
import { computeWeather } from '#dashboard/weather.dashboard.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { CarTelemetry } from '#schema/car-telemetry.schema.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import type { Weather } from '#schema/weather.schema.ts';
import { computeCarTelemetry } from '#server/dashboard/car-telemetry.dashboard.ts';
import telemetryTick from '#server/tick.ts';
import type { Gap } from '#service/gap.service.ts';

const W = 64;

const LINE = '═'.repeat(W);

const formatTime = (s: number): string => {
  if (s <= 0 || !Number.isFinite(s)) return '--:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);

  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

const formatGap = (gap: Gap | null): string => {
  if (gap === null) return 'N/A';

  if (gap.unit === gapUnit.LAPS) return `${gap.value}L`;

  if (!Number.isFinite(gap.value)) return 'N/A';
  const sec = Math.floor(gap.value);
  const ms = Math.round((gap.value % 1) * 1000);

  return `${sec}.${String(ms).padStart(3, '0')}s`;
};

const formatDelta = (d: number | null): string => {
  if (d === null) return 'N/A';
  let sign = '';

  if (d > 0) sign = '+';
  else if (d < 0) sign = '-';
  const abs = Math.abs(d);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);

  return `${sign}${sec}.${String(ms).padStart(3, '0')}s`;
};

const deltaLabel = (d: number | null): string => {
  if (d === null) return '';

  return d >= 0 ? 'slower' : 'faster';
};

type RowInput = {
  label: string;
  value: string;
};

const row = ({ label, value }: RowInput) =>
  console.log(`║    ${`${label}${value}`.padEnd(W - 2)}║`);

const printCar = (car: Car | null): void => {
  if (!car) {
    console.log(`║    ${'none'.padEnd(W - 2)}║`);

    return;
  }

  const carLine = `P${String(car.position).padStart(2)}  ${car.driver.name.padEnd(32)} ${car.driver.car}`;
  console.log(`║    ${carLine.padEnd(W - 2)}║`);
  row({
    label: 'iRating: ',
    value: String(car.driver.iRating),
  });
  row({
    label: 'License: ',
    value: car.driver.license,
  });
  row({
    label: 'Last   : ',
    value: formatTime(car.lastLapTime),
  });
  row({
    label: 'Best   : ',
    value: formatTime(car.bestLapTime),
  });
};

const printHead2Head = (head2Head: Head2Head | null): void => {
  console.clear();

  if (!head2Head) {
    console.log('Waiting for session…');

    return;
  }

  const { gapAhead, gapBehind, deltaAhead, deltaBehind } = head2Head;

  console.log(`╔${LINE}╗`);
  console.log(`║  ${'H2H iRACING BATTLE MONITOR'.padEnd(W)}║`);
  console.log(`╠${LINE}╣`);
  console.log(`║  ${'AHEAD'.padEnd(W)}║`);

  if (!head2Head.ahead) {
    console.log(`║    ${'You are the leader'.padEnd(W - 2)}║`);
  } else {
    printCar(head2Head.ahead);
  }

  console.log(`╠${LINE}╣`);
  console.log(`║  ${'PLAYER'.padEnd(W)}║`);
  printCar(head2Head.player);
  row({
    label: 'Gap ahead : ',
    value: formatGap(gapAhead),
  });
  row({
    label: 'Gap behind: ',
    value: formatGap(gapBehind),
  });
  row({
    label: 'vs ahead  : ',
    value: `${formatDelta(deltaAhead)} ${deltaLabel(deltaAhead)}`,
  });
  row({
    label: 'vs behind : ',
    value: `${formatDelta(deltaBehind)} ${deltaLabel(deltaBehind)}`,
  });
  console.log(`╠${LINE}╣`);
  console.log(`║  ${'BEHIND'.padEnd(W)}║`);

  if (!head2Head.behind) {
    console.log(`║    ${'You are the last'.padEnd(W - 2)}║`);
  } else {
    printCar(head2Head.behind);
  }

  console.log(`╚${LINE}╝`);
};

const formatTimeOfDay = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const compassIndex = (deg: number): number => Math.round((((deg % 360) + 360) % 360) / 45) % 8;

// Relative wind: 0°=headwind, 90°=crosswind from right, 180°=tailwind, 270°=crosswind from left
const RELATIVE_WIND_LABELS = [
  'Headwind',
  'Front-right wind',
  'Crosswind (right)',
  'Rear-right wind',
  'Tailwind',
  'Rear-left wind',
  'Crosswind (left)',
  'Front-left wind',
] as const;

const relativeWindIndex = (deg: number): number => Math.round(deg / 45) % 8;

// Car diagram: ▲ is centered at column 11 in each row.
// Arrow positions: tl=front-left, tc=headwind, tr=front-right,
//                 ml=left crosswind, mr=right crosswind,
//                 bl=rear-left, bc=tailwind, br=rear-right
const buildCarDiagram = (relIdx: number): string[] => {
  const tl = relIdx === 7 ? '↘' : ' ';
  const tc = relIdx === 0 ? '↓' : ' ';
  const tr = relIdx === 1 ? '↙' : ' ';
  const ml = relIdx === 6 ? '→' : ' ';
  const mr = relIdx === 2 ? '←' : ' ';
  const bl = relIdx === 5 ? '↗' : ' ';
  const bc = relIdx === 4 ? '↑' : ' ';
  const br = relIdx === 3 ? '↖' : ' ';

  return [
    '         FRONT',
    `       ${tl}   ${tc}   ${tr}`,
    `   L   ${ml}   ▲   ${mr}   R`,
    `       ${bl}   ${bc}   ${br}`,
    '          REAR',
  ];
};

const printWeather = (weather: Weather): void => {
  const kmh = (weather.windVelocityMs * 3.6).toFixed(1);
  const windLabel = COMPASS_LABELS[compassIndex(weather.windDirectionDeg)];
  const headingLabel = COMPASS_LABELS[compassIndex(weather.yawNorthDirectionDeg)];
  const relIdx = relativeWindIndex(weather.windRelativeDirectionDeg);
  const relLabel = RELATIVE_WIND_LABELS[relIdx];
  console.log(`╔${LINE}╗`);
  console.log(`║  ${'WEATHER DASHBOARD'.padEnd(W)}║`);
  console.log(`╠${LINE}╣`);
  row({
    label: 'Time:       ',
    value: formatTimeOfDay(weather.sessionSecondsAfterMidnight),
  });
  row({
    label: 'Air Temp:   ',
    value: `${weather.airTemperatureC.toFixed(1)}°C`,
  });
  row({
    label: 'Track Temp: ',
    value: `${weather.trackTemperatureC.toFixed(1)}°C`,
  });
  row({
    label: 'Humidity:   ',
    value: `${weather.relativeHumidityPct}%`,
  });
  row({
    label: 'Rain:       ',
    value: `${Math.round(weather.precipitationPct)}%`,
  });
  row({
    label: 'Wetness:    ',
    value: weather.trackWetness,
  });
  console.log(`╠${LINE}╣`);
  row({
    label: 'Wind:     ',
    value: `${windLabel.padEnd(3)}  (${weather.windDirectionDeg.toFixed(1)}°)  ${kmh} km/h`,
  });
  row({
    label: 'Heading:  ',
    value: `${headingLabel.padEnd(3)}  (${weather.yawNorthDirectionDeg.toFixed(1)}°)`,
  });
  row({
    label: 'Relative: ',
    value: `${relLabel}  (${weather.windRelativeDirectionDeg.toFixed(1)}°)`,
  });
  console.log(`║    ${''.padEnd(W - 2)}║`);

  for (const line of buildCarDiagram(relIdx)) {
    console.log(`║    ${line.padEnd(W - 2)}║`);
  }

  console.log(`║    ${''.padEnd(W - 2)}║`);
  console.log(`╚${LINE}╝`);
};

const flag = (active: boolean) => (active ? 'ON ' : 'OFF');

const printCarTelemetry = (car: CarTelemetry): void => {
  console.log(`╔${LINE}╗`);
  console.log(`║  ${'CAR DASHBOARD'.padEnd(W)}║`);
  console.log(`╠${LINE}╣`);
  row({
    label: 'ABS:        ',
    value: `${car.abs.toFixed(0).padEnd(4)} [${flag(car.isAbsActive)}]`,
  });
  row({
    label: 'TC:         ',
    value: `${car.tc.toFixed(0).padEnd(4)}`,
  });
  row({
    label: 'Brake Bias: ',
    value: `${car.brakeBias.toFixed(2)}%`,
  });
  row({
    label: 'Pit Limiter:',
    value: flag(car.isPitSpeedLimiterActive),
  });
  console.log(`╚${LINE}╝`);
};

while (true) {
  await telemetryTick.tick();

  if (!(await irsdkRepository.isIRacingConnected())) {
    continue;
  }

  const [head2Head, weather, carTelemetry] = await Promise.all([
    computeHead2Head(),
    computeWeather(),
    computeCarTelemetry(),
  ]);

  printHead2Head(head2Head);
  printWeather(weather);
  printCarTelemetry(carTelemetry);

  if (config.DATA_MODE === dataMode.MOCK) break;
  await setTimeout(config.POLL_INTERVAL_MS);
}
