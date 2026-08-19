# Lessons Learned

## Production telemetry

1. `DATA_MODE` selects the telemetry source only.
   - `live` uses `IRSDK.connect()`.
   - `mock` uses `IRSDK.fromDump(DUMP_FILE_PATH)`.
   - It must not change telemetry values.

2. Dump mode must return the exact dump data.
   - Do not force a player car index.
   - Do not force `CarLeftRight`.
   - Do not replace iRating values.

3. Tests select `IRSDKMock` with `NODE_ENV=test`.
   - Tests must not use `DATA_MODE`.
   - A disconnected test fixture must not connect to live iRacing or a dump.

4. Use the real application flow as the source of truth.
   - The server stops broadcasting when iRacing is disconnected.
   - Do not create a connected state with empty telemetry.
   - Do not test states that cannot occur in the application.

## Telemetry fixtures

1. Use one fixture for one scenario.
   - Make the scenario clear from the file name.
   - Do not hide scenarios in frame indexes.
   - Do not couple enum values to frame positions.

2. Reuse a fixture when it already contains the required data.
   - For example, `car.json` can provide SDK lap times and full car data.
   - Do not create a second fixture with duplicate values.

3. Keep fixtures small.
   - Add only the variables and session data required by the test.
   - Remove a fixture when no test uses it.

4. Use `base.json` for the main fixture in a fixture group.
   - Do not use the generic name `values.json`.

5. Use frames only for telemetry that changes with time.
   - Base values are active before the first refresh.
   - The first refresh activates the first frame.
   - Each later refresh activates the next frame.
   - The last frame stays active.

6. Read fixture files synchronously.
   - The files are small.
   - Async file reads made this test suite slower.
   - Keep `IRSDKMock.fromFixture()` and `loadTelemetryFixture()` synchronous.

7. Use dump reports as the source for real telemetry names and shapes.
   - Select a dump from `fixture/`.
   - Run `npm run inspect-memory-dump`.
   - Read `examples/dump-report.html`.
   - Do not parse binary dumps directly when a report is available.

## Test design

1. Do not write defensive tests.
   - Do not test impossible application states.
   - Do not add tests only because production code has a fallback.
   - Test real racing and server states.

2. Make test setup explicit.
   - Load the required fixture inside the test when possible.
   - Do not put a default fixture in `beforeEach` when only some tests need it.
   - A reader must see the test input without searching for hidden setup.

3. Use clear test names.
   - State what iRacing reports.
   - State the expected application result.
   - Example: iRacing reports a car on the left, but no car overlaps, so the left bar has no coloured segment.

4. Avoid redundant expectations.
   - One expectation must prove one behavior.
   - Remove a second expectation when the first one already proves the same result.
   - Keep an explicit exclusion check when exclusion is the behavior under test.

5. Remove tests that add no coverage or behavior value.
   - Measure coverage before and after removal.
   - Remove the unused fixture with the test.

6. Do not keep debug output in tests.
   - Remove `console.log` calls before completion.

7. Run the full test command.
   - A single test file can pass but fail the global coverage thresholds.
   - Use `npm test` for final verification.

8. Run all final checks.
   - `npm test`
   - `npm run build`
   - `npm run lint`

## Code clarity

1. Prefer explicit code over compact code.
   - Use a clear `if` statement when it explains the boundary.
   - Do not use `Math.min` when an explicit condition is easier to read.
   - Do not use modulo when the value must stay at the last frame.

2. Use explicit methods instead of property accessor syntax.
   - Use `getActiveFrame()`.
   - Do not use `get activeFrame()` or `set activeFrame()`.

3. Do not write clever test helpers.
   - A helper such as `loadSide(side)` hid a dependency between enum values and frame indexes.
   - Prefer an explicit fixture path such as `spotter/clear.json`.

4. Import utilities directly.
   - Put gap delta utilities in `src/server/utils/gap-delta.ts`.
   - Import them from that file where needed.
   - Do not re-export utilities from `gap.service.ts`.

5. A spy cannot observe a local function call in the same module.
   - Move shared pure functions to a utility module when callers must be observed.
   - Spy on the imported utility module.
   - Do not change production behavior only to satisfy a test.

6. Use project names consistently.
   - Use `IRSDKMock`.
   - Use `irsdk-mock.ts`.
   - Use `gap-delta.ts`.

## Spotter behavior

1. Treat these `CarLeftRight` values as three-wide:
   - `CAR_LEFT_AND_RIGHT`
   - `TWO_CARS_LEFT`
   - `TWO_CARS_RIGHT`

2. A three-wide state returns:

```ts
{
  left: null,
  right: null,
  isThreeWide: true,
}
```

3. Skip overlap calculation for a three-wide state.
   - iRacing does not identify the car indexes for the reported state.
   - The overlay shows the full three-wide warning.

4. Keep documentation synchronized with behavior.
   - Update `README.md`.
   - Update `docs/spotter-overlap.md`.
   - Update tests and fixtures.

## Working with user changes

1. Inspect a file again before editing it.
   - The user can change files during the session.
   - Do not overwrite new comments or logic.

2. Preserve user decisions.
   - Keep comments that explain real domain behavior.
   - Do not restore logic that the user removed.

3. Acknowledge mistakes directly.
   - Explain why the old implementation worked.
   - Replace confusing code instead of defending it.
   - Roll back an experiment when measurements show it is worse.
