 # Changelog

Meaningful changes from v1.34.0 onward, initialized from local Git history. Tagged entries use consecutive tag comparisons, starting with `v1.33.0..v1.34.0` and ending
with `v1.35.3..v1.35.4`. Older history is intentionally omitted.

The initial unreleased code review covered `v1.35.4..b45c684`; constitution documentation and later changes are recorded below. Tags identify version boundaries here, not
verified package publication or release dates. Remote releases were not checked.

## Unreleased

1. Replaced the active Biome formatting/lint commands with Oxfmt and Oxlint, including `oxlint-anti-slop` rules and Given/When/Then test-title checks. Added
   `npm run check` and switched CI to that combined command. Biome remains a declared dependency.
2. Updated application and development dependencies, including `@hono/node-server` from 1.19.13 to 2.1.5, TypeScript from 6.0.2 to 7.0.2, and Vitest/V8 coverage from
   4.1.2 to 5.0.5. The selected development and packaged Node.js runtime remains 24.14.1. See `git diff v1.35.4..b45c684 -- package.json` for the full version changes.
3. Consolidated per-dashboard SSE broadcasting into shared dispatch.
4. Added standalone mission, tech stack, roadmap, changelog, and accepted architecture decision records.
5. Standardized missing-player behavior across all six overlays. A disconnected simulator or a missing or negative player index now closes all SSE streams and clears
   tracking history. Evidence: [PR #79](https://github.com/emilioSp/h2h-iracing/pull/79), merged as `80592d0`.

## v1.35.4

Updated the release workflow instructions to require approval of release notes before creating a version tag, verify the package before pushing, and verify the resulting
GitHub release. Evidence: `91f8ca0` in `v1.35.3..v1.35.4`.

## v1.35.3

Reworked test scenarios with descriptive fixture names, explicit setup, and clearer test descriptions; removed redundant assertions and low-value configuration tests.
Evidence: `a894228` in `v1.35.2..v1.35.3`.

## v1.35.2

1. Introduced fixture-backed `IRSDKMock` tests selected through `NODE_ENV=test`, with SDK state reset between tests. Tests no longer depend on live iRacing or binary
   dumps.
2. Removed forced player indexes and spotter-side values from development dump mode so displayed data follows the dump instead of fabricated scenarios.
3. Extended the spotter's three-wide warning to include two cars on either side, rather than attributing overlap to an unidentified car.
4. Adjusted fractional laps-remaining calculation to apply a small tolerance before rounding up the projected finish lap.
5. Shared gap delta calculations between H2H and traffic through a utility module, and consolidated agent guidance under shared `AGENTS.md` and `.agents/skills`
   locations.

Evidence: `2c3fb23`, `2a6b5ce`, and related guidance commits in `v1.35.1..v1.35.2`. The earlier forced dump-mode spotter display from v1.34.0 no longer applies.

## v1.35.1

1. Corrected pit-road telemetry handling to use booleans. Spotter and traffic exclude pit-road cars correctly, gaps avoid reference-lap calculations when either car is in
   the pits, and reference recording marks pit laps invalid.
2. Added safe fallback values when SDK last/best lap times are missing.

Evidence: `770a45d` in `v1.35.0..v1.35.1`.

## v1.35.0

Added the multiclass traffic overlay and `/sse/traffic`: faster-class cars within two seconds behind the player, ordered nearest first. Included estimated-lap-time class
detection, class labels inferred from car names, reference-lap recording across classes, browser and SimHub dashboards, packaging, and a memory-dump inspection report
tool. Evidence: `a3370f6` in `v1.34.1..v1.35.0`.

## v1.34.1

Moved runtime spotter constants from the schema module to the SDK repository, removing the spotter's runtime import of its schema module. Evidence: `12b321f` in
`v1.34.0..v1.34.1`.

## v1.34.0

Added the spotter overlay and `/sse/spotter`, showing nearby car overlap and a three-wide warning, with browser assets and SimHub distribution support. Overlap uses track
position and an assumed car length. Its initial development dump mode forced a player and car-right signal; that behavior was removed in v1.35.2. Evidence: `615c779` in
`v1.33.0..v1.34.0`.

## Compatibility evidence

Normal dashboard SSE payload shapes are unchanged by R-02, but missing-player stream behavior has changed: all endpoints now close their streams instead of some
continuing to send values or empty results. Custom SSE clients must handle closure and reconnection.

This is a local-history summary, not a guarantee about upstream dependency compatibility or remote release artifacts.
