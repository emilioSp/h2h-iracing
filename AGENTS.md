# AGENTS.md

## Project Overview

Head-to-head overlay for iRacing. Node.js backend service using TypeScript (strict mode, ESM only) with Hono HTTP framework and SSE support. Reads real-time racing telemetry via `@emiliosp/node-iracing-sdk`.

## General Principles

- KISS: Keep It Simple, Stupid. Code must be readable without comments.
- Solve only the problem at hand. No future-proofing. No Chinese boxes.
- Do not solve problems that you don't have. Don't add features that you don't need. Don't add abstractions that you don't need.
- Avoid comments unless absolutely necessary for clarity.
- Use descriptive variable and function names.

## Communication Rules

- Ask for confirmation on design decisions.
- Ask for clarification when requirements are unclear.
- When in doubt, ask.

## Architecture
see docs/architecture.md

## Feature Workflow

At the end of every feature — before committing — run this checklist to identify which docs need creating or updating.

| Change | `README.md` | `docs/architecture.md` | Feature doc (`docs/*.md`) |
|---|---|---|---|
| New dashboard | yes — feature list, folder structure, API section | yes — mermaid diagram + Layers section | create |
| Updated dashboard behavior | if API shape changed | if structure changed | update existing |
| New SSE endpoint | yes — API section | maybe | maybe |
| New algorithm / computation | no | no | create |
| Updated algorithm | no | no | update existing |
| New env variable | yes — env var table | no | no |

If a feature doc needs to be created, place it under `docs/` and link it from the `README.md` Documentation section.

## TypeScript & Coding Conventions

- **ESM only** - CommonJS is forbidden. Use `import`/`export`, never `require`/`module.exports`.
- **`type` over `interface`** for TypeScript types.
- **Zod type inference** for types shared across layers; dedicated types for layer-internal use.
- **Arrow functions** preferred over classes. Classes only when maintaining internal state.
- **Named exports** preferred. Default exports only for app entrypoint, singletons, and db connection.
- **Pure functions** preferred. Functions should do one thing only.
- **Small functions** - when they grow beyond ~40 lines, consider breaking them down.
- **`async/await` always** - never use callbacks. If forced, wrap with `node:util` `promisify`.
- **Named parameters** - use object destructuring instead of positional parameters. Define a named `type` for the input object and for the return value when returning multiple values or a complex object. Instead, for simple functions that return a single primitive value, do not use a named types.
e.g.
```typescript
type CalculateGapInput = {
  playerLapTime: number;
  targetLapTime: number;
}; 
type CalculateGapOutput = {
  value: number;
  unit: 'seconds';
};

const calculateGap = ({ playerLapTime, targetLapTime }: CalculateGapInput): CalculateGapOutput => {
  const value = playerLapTime - targetLapTime;
  return { value, unit: 'seconds' };
};

const speedUp = (currentSpeed: number): number => {
  return currentSpeed + 10;
};
```
- Use explicit methods instead of property accessor syntax.
   - Use `getActiveFrame()`.
   - Do not use `get activeFrame()` or `set activeFrame()`.


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
   - Example: iRacing reports a car on the left, but no car overlaps, so the left bar has no coloured segment.
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


## Documentation

The `README.md` must include:

1. What the software does.
2. Prerequisites.
3. Local development setup.
4. Local testing instructions.
5. Deployment instructions (if applicable).