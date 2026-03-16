import config from '#config';
import type { BattleState, CarState } from '#schema/battle.schema.ts';
import { computeBattleState } from '#service/battle.service.ts';

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

export const printCar = (
  label: string,
  car: CarState | null,
  gap?: number,
  delta?: number,
) => {
  if (!car) {
    console.log(`║  ${pad(`${label}: none`, W)}║`);
    return;
  }

  console.log(`║  ${pad(`${label} (P${car.position})`, W)}║`);
  console.log(`║    ${pad(`Driver  : ${car.driver.name}`, W - 2)}║`);
  console.log(
    `║    ${pad(`Car     : ${car.driver.car} #${car.driver.carNumber}`, W - 2)}║`,
  );
  console.log(
    `║    ${pad(`iRating : ${car.driver.iRating}  SR: ${car.driver.license}`, W - 2)}║`,
  );
  console.log(
    `║    ${pad(`Best    : ${formatTime(car.bestLapTime)}`, W - 2)}║`,
  );
  console.log(
    `║    ${pad(`Last    : ${formatTime(car.lastLapTime)}`, W - 2)}║`,
  );

  if (gap !== undefined) {
    console.log(`║    ${pad(`Gap     : ${formatGap(gap)}`, W - 2)}║`);
  }
  if (delta !== undefined) {
    console.log(`║    ${pad(`Delta   : ${formatDelta(delta)}`, W - 2)}║`);
  }
};

export const printBattle = (state: BattleState | null): void => {
  console.clear();

  if (!state) {
    console.log('Waiting for race session…');
    return;
  }

  const m = Math.floor(state.sessionTime / 60);
  const s = Math.floor(state.sessionTime % 60);
  const sessionStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  console.log(`╔${LINE}╗`);
  console.log(`║  ${pad('H2H iRACING BATTLE MONITOR', W)}║`);
  console.log(
    `║  ${pad(`Session: ${sessionStr}  |  Player: P${state.player.position}`, W)}║`,
  );
  console.log(`╠${LINE}╣`);

  printCar('Ahead', state.ahead, state.gapAhead, state.deltaAhead);

  console.log(`╠${LINE}╣`);

  printCar('Player', state.player);

  console.log(`╠${LINE}╣`);

  printCar('Behind', state.behind, state.gapBehind, state.deltaBehind);

  console.log(`╚${LINE}╝`);
};

const interval = setInterval(() => {
  const state = computeBattleState();
  printBattle(state);
}, config.POLL_INTERVAL_MS);

process.on('SIGINT', () => {
  clearInterval(interval);
});
