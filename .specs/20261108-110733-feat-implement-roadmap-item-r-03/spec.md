# R-03: Hide traffic during Lone Qualify

Scope: [proposal.md](proposal.md).

## Requirements

### REQ1: Traffic dashboard MUST suppress traffic during Lone Qualify

Delta: modified

Before: traffic computation excludes a player on pit road but does not exclude qualifying sessions.

For a connected player in a `Lone Qualify` session, `/sse/traffic` delivers `{ "data": { "cars": [] } }`; the overlay is blank, not the welcome screen. The stream remains open. Suppression applies even before session results are available and clears rows already displayed when the session changes.

Verified by: [AC1](#ac1-lone-qualify-has-no-traffic-rows), [AC2](#ac2-lone-qualify-without-results-has-no-traffic), [AC3](#ac3-entering-lone-qualify-clears-visible-traffic).

#### AC1: Lone Qualify has no traffic rows

1. GIVEN a connected player on track in `Lone Qualify` with an LMP2 0.1 seconds behind the player's GT3.
2. WHEN a traffic update reaches the overlay.
3. THEN the overlay is blank.
4. Example: player car 0 has an estimated lap of 103.2 seconds; car 1 has 94.6 seconds and a gap of 0.1 seconds; the traffic update is `{ "data": { "cars": [] } }` and no row or welcome screen is visible.

#### AC2: Lone Qualify without results has no traffic

1. GIVEN a connected player in `Lone Qualify` with `ResultsPositions: null` and an otherwise eligible faster car behind.
2. WHEN the next traffic update is delivered.
3. THEN the payload is `{ "data": { "cars": [] } }`.
4. Example: the previous session was `Open Qualify`; the current session reports `SessionType: "Lone Qualify"`, `ResultsPositions: null`, player lap estimate 103.2 seconds, and an LMP2 0.1 seconds behind with lap estimate 94.6 seconds; the next traffic payload contains no cars.

#### AC3: Entering Lone Qualify clears visible traffic

1. GIVEN a connected traffic overlay displaying car 1 in `Open Qualify`.
2. WHEN the current session changes to `Lone Qualify` and the next update arrives on the same stream.
3. THEN the overlay becomes blank.
4. Example: an LMP2 0.1 seconds behind is initially visible; changing only the session to `Lone Qualify` delivers `{ "data": { "cars": [] } }` on the existing connection and removes that row without showing the welcome screen.

## Regression checks

### AC4: Open Qualify continues to show eligible traffic

1. GIVEN a connected player on track in `Open Qualify` with an LMP2 0.1 seconds behind the player's GT3.
2. WHEN a traffic update reaches the overlay.
3. THEN the LMP2 row is visible.
4. Example: player car 0 has an estimated lap of 103.2 seconds; car 1 has 94.6 seconds and a gap of 0.1 seconds; the traffic payload includes car 1 and its row is displayed.

### AC5: Leaving Lone Qualify restores eligible traffic

1. GIVEN a connected traffic overlay blank during `Lone Qualify` with an otherwise eligible LMP2 0.1 seconds behind.
2. WHEN the current session changes to `Open Qualify` and the next update arrives on the same stream.
3. THEN the LMP2 row is visible.
4. Example: player car 0 has an estimated lap of 103.2 seconds and car 1 has 94.6 seconds; changing the session from `Lone Qualify` to `Open Qualify` makes car 1 appear without reconnecting.

## Assumptions

* The exclusion uses the current session's `SessionType: "Lone Qualify"`; other session types retain their existing traffic behavior.
* Existing pit-road exclusions and missing-player connection policy remain unchanged.
