# Roadmap

This roadmap records owner-approved priorities and accepted outcomes. It is planning context, not permission to implement. The owner selects work and approves its
requirements before implementation. Later ideas have no promised order or date.

| ID   | Title                                                                                                                      | Status    | Summary                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| R-01 | [Existing overlay baseline](#r-01-existing-overlay-baseline)                                                               | Completed | Six overlays provide head-to-head, weather, car telemetry, fuel, spotter, and multiclass traffic information.    |
| R-02 | [Standardize SSE behavior when no player car is available](#r-02-standardize-sse-behavior-when-no-player-car-is-available) | Completed | All six overlays share one connection policy, with integration coverage for shutdown and tracking cleanup.       |
| R-03 | [Hide traffic during qualifying](#r-03-hide-traffic-during-qualifying)                                                     | Next      | Keep the traffic dashboard hidden during qualifying sessions.                                                    |
| R-04 | [Show player counts by category](#r-04-show-player-counts-by-category)                                                     | Later     | Compute and display the total number of session players, broken down by category.                                |
| R-05 | [Create a dedicated H2H UI without SimHub](#r-05-create-a-dedicated-h2h-ui-without-simhub)                                 | Now       | Discover the standalone UI design and produce an ADR plus a technical design document with implementation tasks. |
| R-06 | [Show average iRating by category](#r-06-show-average-irating-by-category)                                                 | Later     | Compute and display average session player iRating for each category.                                            |

## Completed

### R-01: Existing overlay baseline

The existing suite provides head-to-head, weather, car telemetry, fuel, spotter, and multiclass traffic overlays. The owner accepted these six overlays as the completed
baseline, with known fixes tracked separately. No completion date was established.

#### Evidence

The owner explicitly confirmed acceptance during constitution initialization. [README.md](README.md) describes the six overlays and their SSE endpoints;
[dashboard code](src/server/dashboard) and [architecture](docs/architecture.md) show their implementation. Local Git history includes spotter commit `615c779` and traffic
commit `a3370f6`. These records were inspected locally; remote publication was not checked.

### R-02: Standardize SSE behavior when no player car is available

All six overlays now share one connection policy. A disconnected simulator or a missing or negative player index closes every SSE stream and clears tracking history. The
overlays keep their existing welcome and reconnect behavior. Valid empty results and nullable calculation fields remain normal data, not disconnection signals. Temporary
missing-player gaps and recovery on the same stream are not supported scenarios.

#### Evidence

Implemented in [PR #79](https://github.com/emilioSp/h2h-iracing/pull/79), merged as `80592d0`. Integration tests cover player loss, loss revealed during telemetry
refresh, shutdown of all six streams without invalid payloads, tracking cleanup, and normal data delivery. Final verification passed `npm run check` with 189 tests.

## Now

### R-05: Create a dedicated H2H UI without SimHub

#### Objective

Run discovery for a dedicated H2H UI that removes the need for SimHub. Existing browser dashboards are the starting point; this is not the first browser UI. This phase
defines the design and implementation plan, not the UI implementation.

Discovery must resolve the UI's scope, how users launch and arrange it, and the impact on existing SimHub and OBS workflows. Technical choices remain open until reviewed
and approved by the owner.

#### Deliverables

1. A new entry in [ADR.md](ADR.md) recording the selected approach, alternatives considered, reasons, and consequences. Mark it accepted only after owner approval.
2. A technical design document under `docs/` explaining the new UI's user workflows, architecture, integration with the existing overlays and backend, and compatibility
   implications. Include an ordered list of implementation tasks.

#### Completed when

The owner has reviewed and approved the ADR entry and technical design document, including its task list. UI implementation is separate work after discovery.

## Next

### R-03: Hide traffic during qualifying

#### Objective

Fix the traffic dashboard so it stays hidden during a qualifying session. The [current traffic dashboard](src/server/dashboard/traffic.dashboard.ts) has no
qualifying-session check. Existing traffic detection is described in [docs/traffic-detection.md](docs/traffic-detection.md); that document does not yet specify this fix.

#### Completed when

The traffic dashboard is hidden during qualifying, including when nearby faster cars would otherwise produce traffic rows.

## Later

### R-04: Show player counts by category

#### Objective

Compute and show the total number of players in a session, broken down by category. Whether to extend an existing dashboard or create a new one remains open. Existing
driver metadata is available in the [driver repository](src/server/repository/driver.repository.ts), but the requested count display is not implemented.

#### Completed when

Not yet defined. The owner must decide which session players count, how categories are identified, and where the totals appear.

### R-06: Show average iRating by category

#### Objective

Compute and show average player iRating for each category in a session. Whether to use an existing dashboard or a new one remains open. The
[driver schema](src/schema/driver.schema.ts) already includes individual iRating values, but the requested averages and display are not implemented.

#### Completed when

Not yet defined. The owner must decide which players contribute, how categories and missing ratings are handled, and where the averages appear.
