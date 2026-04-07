import { setTimeout } from 'node:timers/promises';
import config from '#config';
import { isIRacingConnected } from '#repository/irsdk.repository.ts';
import type { Car } from '#schema/car.schema.ts';
import type { Head2Head } from '#schema/head2head.schema.ts';
import type { Weather } from '#schema/weather.schema.ts';
import type { Gap } from '#service/gap.service.ts';
import { computeHead2Head } from '#service/head2head.service.ts';
import { computeWeather } from '#service/weather.service.ts';

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

const COMPASS_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const COMPASS_ARROWS = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'] as const;

const windCompassIndex = (rad: number): number => {
  const deg = ((rad * 180) / Math.PI + 360) % 360;
  return Math.round(deg / 45) % 8;
};

export const printWeather = (weather: Weather): void => {
  const idx = windCompassIndex(weather.windDirectionRad);
  const label = COMPASS_LABELS[idx];
  const arrow = COMPASS_ARROWS[idx];
  const deg = ((weather.windDirectionRad * 180) / Math.PI + 360) % 360;
  const kmh = (weather.windVelocityMs * 3.6).toFixed(1);

  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('WEATHER DASHBOARD', W)}║`);
  console.log(`╠${LINE}╣`);
  row('Air Temp:   ', `${weather.airTemperatureC.toFixed(1)}°C`);
  row('Track Temp: ', `${weather.trackTemperatureC.toFixed(1)}°C`);
  row('Humidity:   ', `${Math.round(weather.relativeHumidityPct)}%`);
  row('Rain:       ', `${Math.round(weather.precipitationPct)}%`);
  row('Wetness:    ', weather.trackWetness);
  console.log(`╠${LINE}╣`);
  row('Direction:  ', `${label}  (${deg.toFixed(1)}°)`);
  console.log(`║    ${pad('', W - 2)}║`);
  console.log(`║    ${pad('     N', W - 2)}║`);
  console.log(`║    ${pad('  NW   NE', W - 2)}║`);
  console.log(`║    ${pad(` W  ${arrow}  E`, W - 2)}║`);
  console.log(`║    ${pad('  SW   SE', W - 2)}║`);
  console.log(`║    ${pad('     S', W - 2)}║`);
  console.log(`║    ${pad('', W - 2)}║`);
  console.log(`╠${LINE}╣`);
  row('Speed:      ', `${kmh} km/h`);
  console.log(`╚${LINE}╝`);
};

while (true) {
  if (!(await isIRacingConnected())) {
    continue;
  }
  const [head2Head, weather] = await Promise.all([
    computeHead2Head(),
    computeWeather(),
  ]);

  printHead2Head(head2Head);
  printWeather(weather);

  if (config.DATA_MODE === 'mock') break;
  await setTimeout(config.POLL_INTERVAL_MS);
}
