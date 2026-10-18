# AGENTS.md

## Project Overview

Head-to-head overlay for iRacing. Node.js backend service using TypeScript (strict mode, ESM only) with Hono HTTP framework and SSE support. Reads real-time racing
telemetry via `@emiliosp/node-iracing-sdk`.

## Architecture

see docs/architecture.md

## Feature Workflow

At the end of every feature — before committing — run this checklist to identify which docs need creating or updating.

| Change                      | `README.md`                                       | `docs/architecture.md`                 | Feature doc (`docs/*.md`) |
| --------------------------- | ------------------------------------------------- | -------------------------------------- | ------------------------- |
| New dashboard               | yes — feature list, folder structure, API section | yes — mermaid diagram + Layers section | create                    |
| Updated dashboard behavior  | if API shape changed                              | if structure changed                   | update existing           |
| New SSE endpoint            | yes — API section                                 | maybe                                  | maybe                     |
| New algorithm / computation | no                                                | no                                     | create                    |
| Updated algorithm           | no                                                | no                                     | update existing           |
| New env variable            | yes — env var table                               | no                                     | no                        |

If a feature doc needs to be created, place it under `docs/` and link it from the `README.md` Documentation section.

## Commands

Run `npm run check` when finishing a coding task.

## Frontend Conventions

- Prefer CSS grid over flexbox for layout.
- Use tailwind utilities for styling. Do not define custom CSS classes unless necessary.

## Backend Conventions

- **API responses**: `{ data: T }` for success, `{ error: { code, message } }` for errors.
- **Error handling**: Custom Error classes in `src/error/`, discriminated via `instanceof`.
- **Logging**: `console`-based with `LOG_LEVEL` env var (debug, info, warn, error).

## Testing

- Unit tests only for complex pure functions/algorithms, integration tests for feature flows (prefer over unit tests)
- Tests select `IRSDKMock` with `NODE_ENV=test`.
  - Tests must not use `DATA_MODE`.
  - A disconnected test fixture must not connect to live iRacing or a dump.
- Use one fixture for one scenario.
  - Make the scenario clear from the file name.
  - Do not hide scenarios in frame indexes.
- Reuse a fixture when it already contains the required data. Do not create a second fixture with duplicate values.
  - For example, `car.json` can provide SDK lap times and full car data.
- Keep fixtures small. Add only the variables and session data required by the test.
- Do not write clever test helpers. Be stupid and explicit.
- Make test setup explicit.
  - Load the required fixture inside the test when possible.
  - Do not put a default fixture in `beforeEach` when only some tests need it.
  - A reader must see the test input without searching for hidden setup.
- Use clear test names.
  - State what iRacing reports.
  - State the expected application result.
  - Example: when iRacing reports a car on the left, but no car overlaps, then the left bar has no coloured segment.
- Avoid redundant expectations.
  - One expectation must prove one behavior.
  - Remove a second expectation when the first one already proves the same result.
  - Keep an explicit exclusion check when exclusion is the behavior under test.
- Do not write meaningless tests, that add no coverage or behavior value.
  - Measure coverage before and after removal.
  - Remove the unused fixture with the test.
- Run the full test command.
  - A single test file can pass but fail the global coverage thresholds.
  - Use `npm test` for final verification.
- Run all final checks.
  - `npm test`
  - `npm run build`
  - `npm run lint`
