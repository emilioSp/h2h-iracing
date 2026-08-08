#!/usr/bin/env node
// Inspect what iRacing actually exposes, before designing a dashboard around it.
//
//   node .claude/skills/new-dashboard/scripts/probe-sdk.mjs --search tire
//   node .claude/skills/new-dashboard/scripts/probe-sdk.mjs SPEED CAR_IDX_LAP_DIST_PCT
//
// Reads the mock dump from DUMP_FILE_PATH in .env, so it needs no running sim.

import { readFileSync } from 'node:fs';
import { IRSDK, VARS } from '@emiliosp/node-iracing-sdk';

const readDumpPath = () => {
  if (process.env.DUMP_FILE_PATH) return process.env.DUMP_FILE_PATH;
  const env = readFileSync('.env', 'utf-8');
  const match = env.match(/^DUMP_FILE_PATH=(.*)$/m);
  if (!match) throw new Error('DUMP_FILE_PATH not found in .env');
  return match[1].trim();
};

const args = process.argv.slice(2);

if (args[0] === '--search') {
  const term = (args[1] ?? '').toLowerCase();
  const hits = Object.entries(VARS).filter(
    ([key, value]) =>
      key.toLowerCase().includes(term) || value.toLowerCase().includes(term),
  );
  if (hits.length === 0) {
    console.log(`No VARS match "${term}".`);
    console.log('Doc comments with units live in:');
    console.log('  node_modules/@emiliosp/node-iracing-sdk/dist/vars.d.ts');
  }
  for (const [key, value] of hits) console.log(`${key.padEnd(38)} ${value}`);
  process.exit(0);
}

const ir = IRSDK.fromDump(readDumpPath());
ir.refreshSharedMemory();

const playerCarIdx = ir.get(VARS.PLAYER_CAR_IDX)[0];
const weekend = ir.getSessionInfo('WeekendInfo');
const trackLengthMeters = Number.parseFloat(weekend?.TrackLength ?? '0') * 1000;

console.log(`dump            ${readDumpPath()}`);
console.log(`playerCarIdx    ${playerCarIdx}`);
console.log(`trackLength     ${trackLengthMeters} m`);
console.log(`track           ${weekend?.TrackDisplayName ?? '?'}`);

if (args.length === 0) {
  console.log('\nPass VAR names to print their values, or --search <term>.');
  process.exit(0);
}

// Per-car arrays are far more useful shown next to their car index, and the
// player's own row is usually the one you are reasoning about.
for (const name of args) {
  const key = VARS[name] ?? name;
  let value;
  try {
    value = ir.get(key);
  } catch (e) {
    console.log(`\n${name}  <unreadable: ${e.message}>`);
    continue;
  }

  if (!Array.isArray(value)) {
    console.log(`\n${name} = ${value}`);
    continue;
  }

  if (value.length === 1) {
    console.log(`\n${name} = ${value[0]}`);
    continue;
  }

  console.log(`\n${name}  (${value.length} entries)`);
  value.forEach((entry, carIdx) => {
    if (entry === -1 || entry === undefined) return;
    const marker = carIdx === playerCarIdx ? ' <- player' : '';
    console.log(`  [${String(carIdx).padStart(2)}] ${entry}${marker}`);
  });
}
