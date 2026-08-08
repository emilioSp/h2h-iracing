---
name: new-dashboard
description: End-to-end workflow for adding a new dashboard/overlay to h2h-iracing. Use this whenever the user wants a new overlay, dashboard, gauge, or on-screen readout for iRacing — including vague asks like "can we show tyre temps", "I want something for pit stops", "add a delta bar", or "the driver needs to know X while driving" — even when they never say the word "dashboard". Covers the mandatory brainstorming phase, the full server/UI/package/docs/website file checklist, and the two artefacts only the user can supply.
---

# Add a new dashboard to h2h-iracing

## Overview

A dashboard touches ~20 files across five layers. Miss one and the overlay works in dev but is
absent from the packaged release, or from the website, or never reaches SimHub users.

**Announce at start:** "I'm using the new-dashboard skill."

**Core principle:** iRacing's shared memory is minimal. A dashboard almost never just echoes a
var — it computes something on top. Work out *what* you are computing, and *whether the data
even exists*, before writing any code.

---

## Phase 0 — Brainstorm (do not skip)

This is the most important phase. Skipping it means discovering halfway through the UI that the
data you assumed exists does not.

### First, find out what iRacing actually gives you

Never assume a var exists. The spotter overlay was designed around an "overlap percentage" that
turned out not to exist anywhere in shared memory — the whole algorithm had to be derived from
lap-distance deltas instead. Ten minutes of probing saves a rewrite.

```bash
# List every var whose name matches a keyword
node .claude/skills/new-dashboard/scripts/probe-sdk.mjs --search tire

# Print live values from the mock dump
node .claude/skills/new-dashboard/scripts/probe-sdk.mjs CAR_IDX_LAP_DIST_PCT SPEED
```

Also read the doc comments in
`node_modules/@emiliosp/node-iracing-sdk/dist/vars.d.ts` — they carry units and semantics that
the names alone do not. Session-info fields (car metadata, track length) live in `types.d.ts`.

### Then ask the user

Ask about anything genuinely ambiguous. Concretely, these are the questions that mattered for
past dashboards and tend to matter again:

- **The one question.** What does the driver need answered at a glance, mid-corner? A dashboard
  with two jobs usually wants to be two dashboards.
- **The computation.** Which raw vars feed it, and what is derived? What constants or
  assumptions does the derivation need? (Car length is not exposed by iRacing, so the spotter
  hardcodes 4.8 m — that kind of thing must be a conscious, documented choice.)
- **Degenerate cases.** Player not in a car, alone on track, in the pits, session not started,
  track length unknown. What should the payload be?
- **Visibility.** Always on, or does it appear only when relevant? The spotter renders nothing
  until a car is alongside, which changed the whole frontend shape.
- **Canvas.** Transparent strip floating over gameplay, or an opaque panel? What size? Existing
  panels are 800×480; the spotter is a transparent 800×200 strip.
- **Scope.** All cars, or only the player's class? Multiclass racing usually means all cars —
  `getCarsIdx()` for everything, `getPlayerClassCarIdx()` for class-only.

Write the outcome to `plans/<yyyy-mm-dd>-<name>-dashboard.md`. Do not commit it — the user
handles commits, and design docs stay out of git.

---

## Phase 1 — Server

Naming: `<name>` is the kebab-case dashboard name (`spotter`, `fuel`, `weather`). Layer suffixes
are mandatory (`.service.ts`, `.repository.ts`, `.dashboard.ts`, `.router.ts`).

### `src/schema/<name>.schema.ts`

Zod schema and the inferred payload types. **Types only** — server code must never import a
runtime *value* from `#schema`.

`scripts/package.ts` copies `src/server` into the release bundle and nothing else, so
`src/schema` does not exist at runtime in a packaged install. Type-only imports erase at build
time and are fine; a value import resolves at runtime and kills the packaged server with
`ERR_MODULE_NOT_FOUND`. Because the shared `irsdk.repository.ts` is loaded by every dashboard,
one bad import there takes down *all* the overlays, not just yours — and dev mode never shows it,
because in dev `src/schema` is right there on disk.

Shared enums of raw iRacing values belong in `irsdk.repository.ts` alongside `TRACK_WETNESS_LABELS`
and `CAR_LEFT_RIGHT`. That is the layer that wraps the SDK, and both services and dashboards may
import from it.

### `src/server/repository/irsdk.repository.ts` (edit)

One `withConnect` one-liner per var, matching the existing style:

```ts
export const getCarLeftRight = withConnect(
  (): number => ir?.get(VARS.CAR_LEFT_RIGHT)[0] ?? 0,
);
```

`getSessionInfo` caches parsed YAML until the session changes, so calling
`getTrackLengthMeters()` every tick is cheap. No extra cache layer is needed.

### `src/server/service/<name>.service.ts` + `.test.ts`

Pure functions — the algorithm and nothing else. No SDK calls, no I/O. This is the layer worth
unit-testing hard, because it is where the real logic lives and it is trivially testable.

### `src/server/dashboard/<name>.dashboard.ts` + `.test.ts`

`compute<Name>()` orchestrates: read repositories, call services, assemble the typed payload.
Guard clauses first, cheapest exits at the top. Integration-test this against spied repositories.

### `src/server/router/<name>.router.ts`

Copy `car-telemetry.router.ts` verbatim and swap the `dashboardType`.

### `src/server/broadcaster.ts` (edit)

Four edits: add to `dashboardType`, add to the `clients` map, write a `broadcast<Name>()`, add it
to the `Promise.all`. The "all clients disconnected" check is generic
(`[...clients.values()].every(...)`) so it needs no change.

### `src/server/server.ts` (edit)

Three edits — the third is the one people forget:

```ts
app.get('/sse/<name>', <name>Router);
app.get('/<name>', serveStatic({ path: './dist/<name>-dashboard/index.html' }));
// ...and an entry in the console.table so the URL is printed at startup
```

---

## Phase 2 — UI

Create `src/<name>-dashboard/` with `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`.
Copy the structure from `car-dashboard` (opaque panel) or `spotter-dashboard` (transparent
overlay), whichever matches what Phase 0 decided.

- `styles.css` copies the `@theme` colour block, then sets `html, body, #root` to the agreed size.
  Transparent overlays set `background-color: transparent`; panels use `var(--color-bg)`.
- `App.tsx` copies the `EventSource` + 10s-retry effect from `car-dashboard/src/App.tsx` and
  points it at `/sse/<name>`.
- Panels render `<WelcomePage subtitle="..." />` while disconnected. Conditional overlays return
  `null` instead — a permanent welcome screen defeats an overlay that is meant to stay hidden.
- Types come from `#schema/<name>.schema.ts` as type-only imports, so they erase at build time.
- Tailwind utilities only; prefer grid over flexbox. Register keyframe animations as a
  `--animate-*` token in `@theme` rather than hand-writing a CSS class.

### `vite.<name>.config.ts`

Copy `vite.car.config.ts`; change `root`, `base`, `build.outDir`, and the `server.proxy` key to
`/sse/<name>`.

---

## Phase 3 — Build and package

### `package.json` (three edits)

```jsonc
"<name>:start:dev": "vite --config vite.<name>.config.ts",
"<name>:build": "vite build --config vite.<name>.config.ts",
// and append `npm run <name>:build &` to server:start:dev
```

### `scripts/package.ts` (two edits)

An `execSync('npm run <name>:build')` alongside the others, and a `cpSync` for
`dist/<name>-dashboard`. Without these the overlay is missing from the released zip — it works
perfectly on your machine and does not exist for users.

---

## Phase 4 — Docs

`.claude/rules/feature-workflow.md` is the authority; for a new dashboard it requires all three:

- **`README.md`** — feature list bullet, folder-structure block, and a `GET /sse/<name>` section
  with a sample payload and an explanation of any non-obvious field.
- **`docs/architecture.md`** — a node in the mermaid diagram, the SSE edge, and the Layers text.
- **`docs/<feature>.md`** — a feature doc for the computation, linked from the README's
  Documentation section. Explain the algorithm, the units, and the known limitations. If you
  hardcoded a constant or made an approximation, say so here.

---

## Phase 5 — Website

The user supplies a screenshot at `docs/H2H_<name>_dashboard.png`. Eleventy already passes
`docs/*.{jpg,jpeg,png,webp,gif,svg}` through to `/images`, so no config change is needed.

- **`site/_includes/sections/overlays.njk`** — a numbered `pw-overlay-row`, and a `<figure>` in
  the gallery.
- **The overlay count is hardcoded in three places** — `hero.njk` (session strip and the intro
  paragraph) and `what-it-does.njk`. Grep for the spelled-out number: `grep -rn "Four\|Five" site/`.

Then build and check it actually renders:

```bash
npm run site:build
```

Screenshots of this page tend to come back blank in the headless browser. Verify with geometry
instead — `document.elementFromPoint` and `getBoundingClientRect` prove what is really on screen
far better than a screenshot that may silently fail to capture.

---

## Phase 6 — What only the user can do

State both explicitly when handing over; the PR is **not mergeable to main** without them:

1. **SimHub dashie** — `simhub_dashies/H2H-<Name>_dashboard.simhubdash` is a binary export from
   SimHub that cannot be generated here. Once it exists, add its `cpSync` to `scripts/package.ts`.
2. **Screenshot** — needed for the website and the README screenshots section.

---

## Conventions that bite

| Convention | Detail |
|---|---|
| `Pct` means 0–100 | Not a 0–1 fraction. `weather.dashboard.ts` multiplies by 100 before setting `relativeHumidityPct`. |
| Unit suffixes on names | `trackLengthMeters`, `windDirectionRad`, `airTemperatureC`, `windVelocityMs`. Plural `Meters`, not `Meter`. |
| Layering direction | repository → service is not allowed. Put shared SDK enums in `irsdk.repository.ts`, which both services and dashboards may import. |
| `#schema` is types only | Only `src/server` ships in the release bundle. A runtime value import from `#schema` breaks the packaged app while working perfectly in dev. |
| Named parameters | Object destructuring with a named `Input` type, except for single-primitive functions. |
| API shape | `{ data: T }` for success, `{ error: { code, message } }` for errors. |
| Coverage gate | Enforced in `vitest.config.ts`: 80% statements/lines, 75% branches/functions. A new dashboard must not push it under. |

## Mock mode

`DATA_MODE=mock` replays a fixed `.bin` dump, and **the dump may simply not contain your
scenario**. The spotter's `CarLeftRight` reads `1` (all clear) in every frame, so the overlay
would never have appeared in dev.

Force the value at the repository boundary, where the SDK is already being faked:

```ts
export const getCarLeftRight = withConnect((): number =>
  config.DATA_MODE === 'mock'
    ? carLeftRight.CAR_RIGHT
    : (ir?.get(VARS.CAR_LEFT_RIGHT)[0] ?? 0),
);
```

Keeping the fake here rather than in the dashboard keeps the orchestrator's real/mock code paths
identical, so what you see in dev is what runs live. Check whether the dump contains a usable
scenario at all — the probe script prints per-car values so you can pick a car index that does.

## Verify

```bash
npm run lint && npm run build && npm run test
```

`tsc` writes type errors to **stdout**, and the Stop hook only inspects stderr — a hook that
reports "no output" can be hiding a broken build. Read the `npm run build` output yourself.

Then run it for real and look at it:

```bash
npm run server:start:dev          # mock mode, all dashboards
curl -sN --max-time 1 http://localhost:3000/sse/<name> | head -1
```

Open `http://localhost:3000/<name>-dashboard/` and confirm the payload reaches the DOM. For
transparent overlays, check the background really is transparent by injecting a coloured backdrop
in devtools rather than trusting a screenshot against a dark page.

### Then verify the packaged bundle, not just dev

Dev runs against the whole repo, so it cannot catch anything that fails purely because a file was
left out of the zip. `npm run package` exiting cleanly proves the build ran, not that the result
works. Extract it and boot it:

```bash
npm run package
cd $(mktemp -d) && unzip -q <repo>/h2h-iracing-<version>.zip && cd h2h-iracing
node --env-file=.env src/server/server.ts &
for ep in h2h weather car fuel <name>; do
  printf "  /sse/%s -> %s\n" "$ep" \
    "$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 http://localhost:3000/sse/$ep)"
done
```

Every endpoint should return `200`, and the startup banner should list your dashboard. Check the
zip actually contains your dashie and bundle too:

```bash
unzip -l <zip> | grep -iE "simhubdash|<name>-dashboard"
```

This is not paranoia. The spotter release shipped a zip whose server died on startup with
`ERR_MODULE_NOT_FOUND` — a single runtime import of `#schema` that dev mode resolved happily and
the packager silently omitted. Every overlay was broken and every dev-mode check had passed.

## Common mistakes

| Mistake | Fix |
|---|---|
| Designing before probing the SDK | The var you assumed exists may not. Probe the dump first. |
| Forgetting `scripts/package.ts` | Dashboard works in dev, missing from the released zip. |
| Forgetting the `console.table` entry | Users never learn the URL exists. |
| Leaving the website overlay count stale | "Four overlays" in three places while five ship. |
| Putting a shared SDK enum in the service or in `#schema` | The repository cannot import from the service, and `#schema` is not in the release bundle. Define it in `irsdk.repository.ts`. |
| Only testing in dev mode | `src/schema` and the test fixtures exist on disk in dev. Extract the zip and start the packaged server before calling it done. |
| Trusting a green Stop hook | `tsc` errors go to stdout; read the build output. |
| Committing the work | The user commits. Leave the tree dirty and summarise what changed. |

## File inventory

Tick these off before declaring done:

```
src/schema/<name>.schema.ts                     new
src/server/service/<name>.service.ts            new
src/server/service/<name>.service.test.ts       new
src/server/dashboard/<name>.dashboard.ts        new
src/server/dashboard/<name>.dashboard.test.ts   new
src/server/router/<name>.router.ts              new
src/server/repository/irsdk.repository.ts       edit  (vars)
src/server/broadcaster.ts                       edit  (4 spots)
src/server/server.ts                            edit  (3 spots)
src/<name>-dashboard/index.html                 new
src/<name>-dashboard/src/main.tsx               new
src/<name>-dashboard/src/App.tsx                new
src/<name>-dashboard/src/styles.css             new
vite.<name>.config.ts                           new
package.json                                    edit  (3 spots)
scripts/package.ts                              edit  (2 spots)
README.md                                       edit  (3 sections)
docs/architecture.md                            edit  (2 spots)
docs/<feature>.md                               new
site/_includes/sections/overlays.njk            edit  (row + figure)
site/_includes/sections/hero.njk                edit  (count ×2)
site/_includes/sections/what-it-does.njk        edit  (count)
docs/H2H_<name>_dashboard.png                   user
simhub_dashies/H2H-<Name>_dashboard.simhubdash  user
```
