import { setTimeout } from 'node:timers/promises';
import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import { computeCarTelemetry } from '#service/car-telemetry.service.ts';
import type { Gap } from '#service/gap.service.ts';
import { computeHead2Head } from '#service/head2head.service.ts';
import { computeWeather } from '#service/weather.service.ts';
import type { Car } from '../src/schema/car.schema.ts';
import type { CarTelemetry } from '../src/schema/car-telemetry.schema.ts';
import type { Head2Head } from '../src/schema/head2head.schema.ts';
import type { Weather } from '../src/schema/weather.schema.ts';

const W = 64;
const LINE = '═'.repeat(W);

const pad = (s: string, len = W) => s.padEnd(len);

export const formatTime = (s: number): string => {
  if (s <= 0 || !Number.isFinite(s)) return '--:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

export const formatGap = (gap: Gap | null): string => {
  if (gap === null) return 'N/A';
  if (gap.unit === 'laps') return `${gap.value}L`;
  if (!Number.isFinite(gap.value)) return 'N/A';
  const sec = Math.floor(gap.value);
  const ms = Math.round((gap.value % 1) * 1000);
  return `${sec}.${String(ms).padStart(3, '0')}s`;
};

export const formatDelta = (d: number | null): string => {
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

const row = (label: string, value: string) =>
  console.log(`║    ${pad(`${label}${value}`, W - 2)}║`);

export const printCar = (car: Car | null): void => {
  if (!car) {
    console.log(`║    ${pad('none', W - 2)}║`);
    return;
  }

  const carLine = `P${String(car.position).padStart(2)}  ${car.driver.name.padEnd(32)} ${car.driver.car}`;
  console.log(`║    ${pad(carLine, W - 2)}║`);
  row('iRating: ', String(car.driver.iRating));
  row('License: ', car.driver.license);
  row('Last   : ', formatTime(car.lastLapTime));
  row('Best   : ', formatTime(car.bestLapTime));
};

export const printHead2Head = (head2Head: Head2Head | null): void => {
  console.clear();

  if (!head2Head) {
    console.log('Waiting for session…');
    return;
  }

  const { gapAhead, gapBehind, deltaAhead, deltaBehind } = head2Head;

  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('H2H iRACING BATTLE MONITOR', W)}║`);
  console.log(`╠${LINE}╣`);

  console.log(`║  ${pad('AHEAD', W)}║`);
  if (!head2Head.ahead) {
    console.log(`║    ${pad('You are the leader', W - 2)}║`);
  } else {
    printCar(head2Head.ahead);
  }
  console.log(`╠${LINE}╣`);

  console.log(`║  ${pad('PLAYER', W)}║`);
  printCar(head2Head.player);
  row('Gap ahead : ', formatGap(gapAhead));
  row('Gap behind: ', formatGap(gapBehind));
  row('vs ahead  : ', `${formatDelta(deltaAhead)} ${deltaLabel(deltaAhead)}`);
  row('vs behind : ', `${formatDelta(deltaBehind)} ${deltaLabel(deltaBehind)}`);
  console.log(`╠${LINE}╣`);

  console.log(`║  ${pad('BEHIND', W)}║`);
  if (!head2Head.behind) {
    console.log(`║    ${pad('You are the last', W - 2)}║`);
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

const COMPASS_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

const compassIndex = (deg: number): number =>
  Math.round((((deg % 360) + 360) % 360) / 45) % 8;

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

export const printWeather = (weather: Weather): void => {
  const kmh = (weather.windVelocityMs * 3.6).toFixed(1);

  const windLabel = COMPASS_LABELS[compassIndex(weather.windDirectionDeg)];
  const headingLabel =
    COMPASS_LABELS[compassIndex(weather.yawNorthDirectionDeg)];
  const relIdx = relativeWindIndex(weather.windRelativeDirectionDeg);
  const relLabel = RELATIVE_WIND_LABELS[relIdx];

  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('WEATHER DASHBOARD', W)}║`);
  console.log(`╠${LINE}╣`);
  row('Time:       ', formatTimeOfDay(weather.sessionSecondsAfterMidnight));
  row('Air Temp:   ', `${weather.airTemperatureC.toFixed(1)}°C`);
  row('Track Temp: ', `${weather.trackTemperatureC.toFixed(1)}°C`);
  row('Humidity:   ', `${weather.relativeHumidityPct}%`);
  row('Rain:       ', `${Math.round(weather.precipitationPct)}%`);
  row('Wetness:    ', weather.trackWetness);
  console.log(`╠${LINE}╣`);
  row(
    'Wind:     ',
    `${windLabel.padEnd(3)}  (${weather.windDirectionDeg.toFixed(1)}°)  ${kmh} km/h`,
  );
  row(
    'Heading:  ',
    `${headingLabel.padEnd(3)}  (${weather.yawNorthDirectionDeg.toFixed(1)}°)`,
  );
  row(
    'Relative: ',
    `${relLabel}  (${weather.windRelativeDirectionDeg.toFixed(1)}°)`,
  );
  console.log(`║    ${pad('', W - 2)}║`);
  for (const line of buildCarDiagram(relIdx)) {
    console.log(`║    ${pad(line, W - 2)}║`);
  }
  console.log(`║    ${pad('', W - 2)}║`);
  console.log(`╚${LINE}╝`);
};

const flag = (active: boolean) => (active ? 'ON ' : 'OFF');

export const printCarTelemetry = (car: CarTelemetry): void => {
  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('CAR DASHBOARD', W)}║`);
  console.log(`╠${LINE}╣`);
  row(
    'ABS:        ',
    `${car.abs.toFixed(0).padEnd(4)} [${flag(car.isAbsActive)}]`,
  );
  row(
    'TC:         ',
    `${car.tc.toFixed(0).padEnd(4)} [${flag(car.isTcActive)}]`,
  );
  row('Brake Bias: ', `${(car.brakeBias).toFixed(2)}%`);
  row('Pit Limiter:', flag(car.isPitSpeedLimiterActive));
  console.log(`╚${LINE}╝`);
};

while (true) {
  if (!(await isIRacingConnected())) {
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

  if (config.DATA_MODE === 'mock') break;
  await setTimeout(config.POLL_INTERVAL_MS);
}
