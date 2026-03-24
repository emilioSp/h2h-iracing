import { setTimeout } from 'node:timers/promises';
import config from '#config';
import type { Car, Head2Head } from '#schema/battle.schema.ts';
import { computeHead2Head } from '#service/head2head.service.ts';

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

export const formatGap = (s: number): string => {
  if (!Number.isFinite(s)) return 'N/A';
  const sec = Math.floor(s);
  const ms = Math.round((s % 1) * 1000);
  return `${sec}.${String(ms).padStart(3, '0')}s`;
};

export const formatDelta = (d: number): string => {
  if (!Number.isFinite(d)) return 'N/A';
  let sign = '';
  if (d > 0) sign = '+';
  else if (d < 0) sign = '-';
  const abs = Math.abs(d);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);
  return `${sign}${sec}.${String(ms).padStart(3, '0')}s`;
};

const deltaLabel = (d: number): string => {
  if (!Number.isFinite(d)) return '';
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
    console.log('Waiting for race session…');
    return;
  }

  const { gapAhead, gapBehind, deltaAhead, deltaBehind, bestRefLapTime } =
    head2Head;

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
  row('Best ref  : ', formatTime(bestRefLapTime));
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

while (true) {
  const head2Head = computeHead2Head();

  printHead2Head(head2Head);

  if (config.DATA_MODE === 'mock') break;
  await setTimeout(config.POLL_INTERVAL_MS);
}
