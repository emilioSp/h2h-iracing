import { setTimeout } from 'node:timers/promises';
import config from '#config';
import type { BattleState, CarState } from '#schema/battle.schema.ts';
import { computeBattleState } from '#service/battle.service.ts';
import { getGap } from '#service/gap.service.ts';
import { tick } from '#service/telemetry.service.ts';

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
  const sign = s >= 0 ? '+' : '-';
  const abs = Math.abs(s);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);
  return `${sign}${sec}.${String(ms).padStart(3, '0')}s`;
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
  return d >= 0 ? '(lost)' : '(gained)';
};

const row = (label: string, value: string) =>
  console.log(`║    ${pad(`${label}${value}`, W - 2)}║`);

export const printCar = (car: CarState | null): void => {
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

export const printBattle = (
  state: BattleState | null,
  gapAhead: number,
  gapBehind: number,
): void => {
  console.clear();

  if (!state) {
    console.log('Waiting for race session…');
    return;
  }

  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('H2H iRACING BATTLE MONITOR', W)}║`);
  console.log(`╠${LINE}╣`);

  console.log(`║  ${pad('AHEAD', W)}║`);
  printCar(state.ahead);
  console.log(`╠${LINE}╣`);

  console.log(`║  ${pad('PLAYER', W)}║`);
  printCar(state.player);
  row('Gap ahead : ', formatGap(gapAhead));
  row('Gap behind: ', formatGap(gapBehind));
  row('vs ahead  : ', `${formatDelta(state.deltaAhead)} ${deltaLabel(state.deltaAhead)}`);
  row('vs behind : ', `${formatDelta(state.deltaBehind)} ${deltaLabel(state.deltaBehind)}`);
  console.log(`╠${LINE}╣`);

  console.log(`║  ${pad('BEHIND', W)}║`);
  printCar(state.behind);
  console.log(`╚${LINE}╝`);
};

while (true) {
  tick();

  const state = computeBattleState();

  if (!state) {
    printBattle(null, NaN, NaN);
    continue;
  }

  const playerIdx = state.player.driver.carIdx;
  const aheadIdx = state.ahead?.driver.carIdx;
  const behindIdx = state.behind?.driver.carIdx;

  const gapAhead = aheadIdx !== undefined ? getGap(playerIdx, aheadIdx) : NaN;
  const gapBehind =
    behindIdx !== undefined ? getGap(playerIdx, behindIdx) : NaN;

  printBattle(state, gapAhead, gapBehind);

  await setTimeout(config.POLL_INTERVAL_MS);
}