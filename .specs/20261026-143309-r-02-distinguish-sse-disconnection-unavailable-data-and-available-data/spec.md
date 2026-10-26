# R-02: Simplify SSE availability handling

> Draft for owner approval. After approval, this specification is the contract for implementation and verification.

## 1. Context, goals, and scope

The six dashboards currently handle missing players differently. The owner requires one connection boundary: connected iRacing must have a nonnegative player index.
Enforce that invariant centrally, then let dashboards compute normal payloads without duplicating connection handling.

Scope includes the SDK repository boundary, redundant dashboard checks and return types, shared broadcasting, integration coverage, and affected documentation.

### Out of scope

Connected missing-player recovery, in-band disconnection or unavailable-data messages, new SSE endpoints, changes to calculations, extra history-management mechanisms,
and unrelated CLI cleanup or roadmap features.

## 2. Requirements and constraints

### Central availability policy

Enforce the player-index invariant inside `connectToIRacing` in `src/server/repository/irsdk.repository.ts`. If the SDK reports connected but its player index is
negative, classify the connection as disconnected rather than throwing an invariant error. The repository's existing missing-value fallback for player index remains -1.

The same policy applies to live, dump, and test SDK instances and must cover newly established and reused connections. Test-mode and already-connected early returns must
not bypass it. Do not duplicate negative-player guards in dashboard computations or broadcast orchestration.

### SSE and dashboard behavior

Use repository connection status as the common availability signal. A simulator disconnection or rejected player-index invariant closes all six dashboard streams through
existing broadcaster shutdown behavior. Do not continue publishing default or empty payloads for a rejected connection. Connection rejection must reach stream shutdown
without an unhandled invariant error.

For a usable connection, compute subscribed dashboards and send the existing `{ data: T }` payloads. Remove whole-dashboard null returns used to signal missing-player
data and the broadcaster branch that closes individual streams for such returns. Do not introduce `{ data: null }` messages.

Preserve normal calculations, valid empty spotter/traffic results, and nullable fields inside valid payloads. An empty traffic list means nothing to warn about; an
unavailable fuel estimate remains a nullable field, not an unavailable whole dashboard.

Keep existing demand-driven polling and session-change, disconnection, and broadcaster-shutdown resets. Add no special player-loss tracking or fuel-sample behavior.

### Browser and direct callers

Keep existing browser behavior: connection errors clear displayed data, show each existing welcome page, and retry after 10 seconds. Valid empty spotter and traffic
results still render nothing. No frontend unavailable-data state or new visual message is required.

Existing CLI callers check repository connection status before ticking and computing dashboards. Preserve that connection-first usage when simplifying dashboard return
contracts.

### Documentation

Update `README.md`'s API section to describe the central availability rule, stream closure, valid empty results, and nullable fields. Update `docs/architecture.md`'s
availability/broadcaster description and replace the obsolete missing-player whole-dashboard-null description in `docs/fuel-computation.md`.

Check `docs/spotter-overlap.md` and `docs/traffic-detection.md` for conflicting availability/display descriptions and update only where needed. Shared protocol details
belong in README rather than being repeated in every feature document. `docs/gap-calculation.md` is unaffected.

## 3. Technical decisions

The owner rejects a missing-player-to-valid-player transition within a still-connected session as a supported lifecycle. An invariant failure is treated as disconnection,
not a recoverable data hole. A future usable connection uses normal new subscriptions, not same-stream null-message recovery.

The installed SDK's `isConnected()` checks shared-memory status and session data, not player index; the application therefore enforces its stronger invariant at the
repository boundary. See `node_modules/@emiliosp/node-iracing-sdk/dist/irsdk.js`.

`withConnect` invokes `connectToIRacing` before each repository operation. Centralization means one validation location, not one validation execution. Read the player
index from the SDK at that boundary rather than calling the wrapped `getPlayerCarIdx`, which would recurse.

`src/server/broadcaster.ts` already checks repository connection status and has shared shutdown/reset handling. `examples/cli.ts` and `examples/fuel-cli.ts` also check
connection first. Player-index reads needed for calculations remain; only redundant availability branches are removed.

Normal available SSE payload shapes and browser error handling remain compatible. The changed behavior is that all overlays use the same repository connection policy
instead of returning dashboard-specific missing-player states.

### Player-driver metadata and performance

The owner confirms that a nonnegative player index implies the player's driver metadata exists. Trust that assumption, as src/server/service/car.service.ts already does.
Do not add a metadata-readiness check in connectToIRacing, tick orchestration, or another boundary.

Preserve the existing SDK metadata cache and normalized driver map. Introduce no additional cache, driver-list scan, or validation pass for this task. This
player-specific assumption does not justify removing unrelated checks or filters for other cars.

## 4. Acceptance criteria

Existing broadcaster tests cover ordinary simulator-disconnection shutdown/reset and several subscription behaviors. Dashboard tests cover normal computations and several
empty and nullable-field cases. The following probes target the new central invariant and integration boundaries without requiring unsupported recovery scenarios.

### AC1: Valid connected SDK instances remain usable

1. Coverage: success.
2. Probe: Query repository connection status for an SDK instance reporting connected with a nonnegative player index, both when first acquired and when reused. Exercise
   the common policy for live, dump, and test paths without requiring a live simulator.
3. Expected result: Repository connection status resolves to true.
4. Example: An SDK reports connected with `PlayerCarIdx = 0`. The initial and repeated `isIRacingConnected()` calls both resolve to true.

### AC2: A negative player index is rejected centrally

1. Coverage: failure.
2. Probe: Query repository connection status when an SDK reports connected but has a negative player index. Cover newly acquired and reused instances and the test path
   without creating a missing-player recovery scenario.
3. Expected result: Repository connection status resolves to false rather than throwing.
4. Example: An SDK reports connected with `PlayerCarIdx = -1`. `isIRacingConnected()` resolves to false, including on a repeated query of that invalid state.

### AC3: Invariant rejection closes every subscribed stream

1. Coverage: failure.
2. Probe: Subscribe clients to all six dashboards, then let broadcasting encounter the invalid connected-SDK state rejected by AC2. Include player loss after valid data,
   without restoring the player on the original streams.
3. Expected result: All six subscribed streams close.
4. Example: H2H, weather, car, fuel, spotter, and traffic have received valid data with player index 0. The SDK still reports connected but now reads player index -1.
   Each original stream closes.

### AC4: Rejected connections publish no dashboard data

1. Coverage: failure.
2. Probe: With all six dashboards subscribed, let broadcasting encounter an SDK reporting connected with player index -1.
3. Expected result: No dashboard payload is delivered for the rejected connection.
4. Example: With player index -1 and stale weather readings still present, the weather subscriber receives no data message for that invalid state. Spotter and traffic
   likewise receive no fabricated clear or empty result; no endpoint sends `{ data: null }`.

### AC5: Invariant rejection uses existing tracking cleanup

1. Coverage: failure.
2. Probe: Establish fuel, lap-time, and reference-lap history and subscribed clients, then let the central boundary reject a negative player index.
3. Expected result: Existing broadcaster shutdown clears the tracked histories.
4. Example: Fuel samples include lap 0 at 50 L and lap 1 at 48 L, with recorded lap-time and reference-lap history. Reject a connected SDK reporting player index -1.
   After broadcast shutdown, those histories are empty.

### AC6: Usable connections retain normal dashboard messages

1. Coverage: unchanged.
2. Probe: With a valid connected player, subscribe to each dashboard and observe its real computed result through broadcasting. Include valid empty spotter/traffic
   results and a valid fuel payload with insufficient samples for estimates.
3. Expected result: Each delivered `data` value matches its normal dashboard result.
4. Example: With player index 0 and no faster traffic, traffic sends `{ "data": { "cars": [] } }`. With one fuel sample at 50 L and 600 seconds remaining, fuel sends a
   data object containing `fuelLevel: 50`, `timeRemaining: 600`, and `medianFuelPerLap: null`.

### AC7: Disconnection retains existing browser welcome displays

1. Coverage: unchanged.
2. Probe: For each browser overlay showing data, deliver a connection error and observe its display.
3. Expected result: Its displayed dashboard is replaced by its existing welcome page.
4. Example: Traffic shows car number 6 when its EventSource receives an error. It clears the row and shows its existing Traffic welcome page. The same behavior applies
   using each overlay's existing welcome component.
