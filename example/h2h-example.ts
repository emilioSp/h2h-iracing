/**
 * Example 5: Rank-based lap time gaps (live)
 *
 * Displays, updated every second:
 *  - Car ahead  (P-1) → last lap time, live gap to player
 *  - Player          → last lap time
 *  - Car behind (P+1) → last lap time, live gap to player
 *  - Time gained / lost by the player vs each neighbour (last lap delta)
 *
 * Variables used
 * ──────────────
 * PlayerCarIdx          – our car index (scalar)
 * CarIdxPosition[n]     – race position of every car  (0 = not in race)
 * CarIdxLastLapTime[n]  – last completed lap time of every car  (s)
 * CarIdxEstTime[n]      – estimated time for car n to reach the player's
 *                         current track location (s); diff = live gap
 */
import { IRSDK, SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';

const formatTime = (s: number): string => {
  if (s <= 0) return '  --:--.---';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s % 1) * 1000);
  return `  ${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
};

const formatGap = (s: number): string => {
  if (!Number.isFinite(s)) return '      N/A';
  const sign = s >= 0 ? '+' : '-';
  const abs = Math.abs(s);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);
  return `  ${sign}${sec}.${String(ms).padStart(3, '0')}s`;
};

const formatDeltaLap = (deltaLap: number): string => {
  if (!Number.isFinite(deltaLap)) return '      N/A';

  let sign = '';
  if (deltaLap > 0) sign = '+';
  else if (deltaLap < 0) sign = '-';

  const abs = Math.abs(deltaLap);
  const sec = Math.floor(abs);
  const ms = Math.round((abs % 1) * 1000);
  return `  ${sign}${sec}.${String(ms).padStart(3, '0')}s`;
};

async function main() {
  console.log('Connecting to iRacing...');
  // const ir = await IRSDK.connect();
  // for debugging...
  const ir = await IRSDK.fromDump('./shared-memory_ai_race.bin');
  console.log('Connected! Press Ctrl+C to exit\n');

  // ── Driver info lookup: CarIdx → { iRating, name, car } ─────────────────
  // Built from DriverInfo YAML (session-level, not per-tick telemetry).
  // Refreshed whenever the session info update counter changes.
  type DriverInfo = {
    iRating: number;
    name: string;
    car: string;
    license: string;
  };
  let driverMap: Map<number, DriverInfo> = new Map();
  let lastSessionInfoUpdate = -1;

  const refreshDriverMap = () => {
    const update: number = ir.get(VARS.SESSION_TICK)[0] ?? 0;
    const driverInfo = ir.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO);
    if (update === lastSessionInfoUpdate && driverMap.size > 0) return;
    lastSessionInfoUpdate = update;

    driverMap = new Map<number, DriverInfo>();
    for (const driver of driverInfo.Drivers) {
      const idx = driver.CarIdx;
      if (idx !== undefined) {
        driverMap.set(idx, {
          iRating: Number(driver.IRating ?? 0),
          name: String(driver.UserName ?? ''),
          car: String(driver.CarScreenName ?? ''),
          license: String(driver.LicString ?? ''),
        });
      }
    }
  };

  const interval = setInterval(() => {
    if (!ir.isConnected) {
      console.log('\nDisconnected from iRacing');
      clearInterval(interval);
      process.exit(0);
    }

    // Refresh driver map from session YAML (cheap if unchanged)
    refreshDriverMap();
    ir.refreshSharedMemory();

    // ── Raw data from shared memory ──────────────────────────────────────────
    const playerIdx: number = ir.get(VARS.PLAYER_CAR_IDX)[0] ?? -1;
    const positions: number[] = ir.get(VARS.CAR_IDX_POSITION) ?? [];
    const lastLaps: number[] = ir.get(VARS.CAR_IDX_LAST_LAP_TIME) ?? [];
    const bestLaps: number[] = ir.get(VARS.CAR_IDX_BEST_LAP_TIME) ?? [];
    const estTimes: number[] = ir.get(VARS.CAR_IDX_EST_TIME) ?? [];
    const f2Times: number[] = ir.get(VARS.CAR_IDX_F2_TIME) ?? [];
    const sessionTime: number = ir.get(VARS.SESSION_TIME)[0] ?? 0;

    if (playerIdx < 0 || positions.length === 0) return;

    const playerPos = positions[playerIdx];
    if (playerPos <= 0) {
      console.clear();
      console.log('Waiting for race session to start…');
      return;
    }

    // ── Find rank neighbours ─────────────────────────────────────────────────
    const aheadIdx = positions.findIndex((pos) => pos === playerPos - 1) ?? -1;
    const behindIdx = positions.findIndex((pos) => pos === playerPos + 1) ?? -1;

    // ── Driver info ───────────────────────────────────────────────────────────
    const playerInfo = driverMap.get(playerIdx);
    const aheadInfo = aheadIdx >= 0 ? driverMap.get(aheadIdx) : undefined;
    const behindInfo = behindIdx >= 0 ? driverMap.get(behindIdx) : undefined;

    const playerIR = playerInfo?.iRating ?? NaN;
    const aheadIR = aheadInfo?.iRating ?? NaN;
    const behindIR = behindInfo?.iRating ?? NaN;

    // ── Lap times ────────────────────────────────────────────────────────────
    const playerLap = lastLaps[playerIdx] > 0 ? lastLaps[playerIdx] : NaN;
    const aheadLap =
      aheadIdx >= 0 && lastLaps[aheadIdx] > 0 ? lastLaps[aheadIdx] : NaN;
    const behindLap =
      behindIdx >= 0 && lastLaps[behindIdx] > 0 ? lastLaps[behindIdx] : NaN;

    const playerBest = bestLaps[playerIdx] > 0 ? bestLaps[playerIdx] : NaN;
    const aheadBest =
      aheadIdx >= 0 && bestLaps[aheadIdx] > 0 ? bestLaps[aheadIdx] : NaN;
    const behindBest =
      behindIdx >= 0 && bestLaps[behindIdx] > 0 ? bestLaps[behindIdx] : NaN;

    // ── Live gaps via EstTime ─────────────────────────────────────────────────
    // EstTime = time each car needs to reach the player's current track pos.
    // A car ahead arrives sooner → smaller EstTime → gap is positive.
    const playerEst = estTimes[playerIdx] ?? 0;
    const gapAhead =
      aheadIdx >= 0 ? playerEst - (estTimes[aheadIdx] ?? 0) : NaN;
    const gapBehind =
      behindIdx >= 0 ? (estTimes[behindIdx] ?? 0) - playerEst : NaN;

    // ── Live gaps via F2Time ──────────────────────────────────────────────────
    // F2Time = time behind the leader (fixed reference, same as iRacing black box).
    // Handles lapping correctly; -1 means car is not on track.
    const playerF2 = f2Times[playerIdx] ?? -1;
    const gapAheadF2 =
      aheadIdx >= 0 && f2Times[aheadIdx] >= 0 && playerF2 >= 0
        ? playerF2 - f2Times[aheadIdx]
        : NaN;
    const gapBehindF2 =
      behindIdx >= 0 && f2Times[behindIdx] >= 0 && playerF2 >= 0
        ? f2Times[behindIdx] - playerF2
        : NaN;

    // ── Lap delta: positive = player was faster that lap ─────────────────────
    const deltaAhead =
      Number.isFinite(playerLap) && Number.isFinite(aheadLap)
        ? aheadLap - playerLap
        : NaN;
    const deltaBehind =
      Number.isFinite(playerLap) && Number.isFinite(behindLap)
        ? behindLap - playerLap
        : NaN;

    // ── Render ────────────────────────────────────────────────────────────────
    const m = Math.floor(sessionTime / 60);
    const s = Math.floor(sessionTime % 60);
    const sessionStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    console.clear();
    console.log(
      '╔══════════════════════════════════════════════════════════════╗',
    );
    console.log(
      '║              IRACING RANK GAPS MONITOR                      ║',
    );
    console.log(`║  Session time: ${sessionStr.padEnd(47)}║`);
    console.log(
      '╠══════════════════════════════════════════════════════════════╣',
    );
    console.log(`║  Player position: P${String(playerPos).padEnd(43)}║`);
    console.log(
      '╠══════════════════════════════════════════════════════════════╣',
    );

    // Car ahead row
    if (aheadIdx >= 0) {
      const irStr = Number.isFinite(aheadIR) ? String(aheadIR) : 'N/A';
      console.log(
        `║  Car ahead   (P${String(playerPos - 1).padEnd(2)})                                         ║`,
      );
      console.log(`║    Driver   : ${(aheadInfo?.name ?? 'N/A').padEnd(48)}║`);
      console.log(`║    Car      : ${(aheadInfo?.car ?? 'N/A').padEnd(48)}║`);
      console.log(`║    iRating  : ${irStr.padEnd(48)}║`);
      console.log(`║    SR       : ${aheadInfo?.license.padEnd(48)}║`);
      console.log(`║    Best lap : ${formatTime(aheadBest).padEnd(48)}║`);
      console.log(`║    Last lap : ${formatTime(aheadLap).padEnd(48)}║`);
      console.log(`║    Gap (EstT): ${formatGap(gapAhead).padEnd(47)}║`);
      console.log(`║    Gap (F2T) : ${formatGap(gapAheadF2).padEnd(47)}║`);
    } else {
      console.log(
        '║  Car ahead   : none (you are leading)                        ║',
      );
    }

    console.log(
      '╠══════════════════════════════════════════════════════════════╣',
    );

    // Player row
    const playerIRStr = Number.isFinite(playerIR) ? String(playerIR) : 'N/A';
    console.log(
      `║  Player      (P${String(playerPos).padEnd(2)})                                         ║`,
    );
    console.log(`║    Driver   : ${(playerInfo?.name ?? 'N/A').padEnd(48)}║`);
    console.log(`║    Car      : ${(playerInfo?.car ?? 'N/A').padEnd(48)}║`);
    console.log(`║    iRating  : ${playerIRStr.padEnd(48)}║`);
    console.log(`║    SR       : ${playerInfo?.license.padEnd(48)}║`);
    console.log(`║    Best lap : ${formatTime(playerBest).padEnd(48)}║`);
    console.log(`║    Last lap : ${formatTime(playerLap).padEnd(48)}║`);
    if (aheadIdx >= 0)
      console.log(`║    vs ahead : ${formatDeltaLap(deltaAhead).padEnd(48)}║`);
    if (behindIdx >= 0)
      console.log(`║    vs behind: ${formatDeltaLap(deltaBehind).padEnd(48)}║`);

    console.log(
      '╠══════════════════════════════════════════════════════════════╣',
    );

    // Car behind row
    if (behindIdx >= 0) {
      const irStr = Number.isFinite(behindIR) ? String(behindIR) : 'N/A';
      console.log(
        `║  Car behind  (P${String(playerPos + 1).padEnd(2)})                                         ║`,
      );
      console.log(`║    Driver   : ${(behindInfo?.name ?? 'N/A').padEnd(48)}║`);
      console.log(`║    Car      : ${(behindInfo?.car ?? 'N/A').padEnd(48)}║`);
      console.log(`║    iRating  : ${irStr.padEnd(48)}║`);
      console.log(`║    SR       : ${behindInfo?.license.padEnd(48)}║`);
      console.log(`║    Best lap : ${formatTime(behindBest).padEnd(48)}║`);
      console.log(`║    Last lap : ${formatTime(behindLap).padEnd(48)}║`);
      console.log(`║    Gap (EstT): ${formatGap(gapBehind).padEnd(47)}║`);
      console.log(`║    Gap (F2T) : ${formatGap(gapBehindF2).padEnd(47)}║`);
    } else {
      console.log(
        '║  Car behind  : none (you are last)                           ║',
      );
    }

    console.log(
      '╚══════════════════════════════════════════════════════════════╝',
    );
  }, 1000);

  process.on('SIGINT', () => {
    clearInterval(interval);
    ir.shutdown();
    console.log('\nShutdown complete');
    process.exit(0);
  });
}

main().catch(console.error);
