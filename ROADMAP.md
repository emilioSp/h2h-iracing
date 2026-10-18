# Roadmap

This roadmap records owner-approved priorities and accepted outcomes. It is planning context, not permission to implement. The owner selects work and approves its
requirements before implementation. Later ideas have no promised order or date.

| ID   | Title                                                                                                                      | Status    | Summary                                                                                                       |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| R-01 | [Existing overlay baseline](#r-01-existing-overlay-baseline)                                                               | Completed | Six overlays provide head-to-head, weather, car telemetry, fuel, spotter, and multiclass traffic information. |
| R-02 | [Standardize SSE behavior when no player car is available](#r-02-standardize-sse-behavior-when-no-player-car-is-available) | Now       | Establish consistent unavailable-data behavior and verify player loss and recovery with integration tests.    |
| R-03 | [Hide traffic during qualifying](#r-03-hide-traffic-during-qualifying)                                                     | Next      | Keep the traffic dashboard hidden during qualifying sessions.                                                 |
| R-04 | [Show player counts by category](#r-04-show-player-counts-by-category)                                                     | Later     | Compute and display the total number of session players, broken down by category.                             |
| R-05 | [Create a dedicated H2H UI without SimHub](#r-05-create-a-dedicated-h2h-ui-without-simhub)                                 | Later     | Provide a dedicated H2H UI and remove the need for SimHub.                                                    |
| R-06 | [Show average iRating by category](#r-06-show-average-irating-by-category)                                                 | Later     | Compute and display average session player iRating for each category.                                         |

## Completed

### R-01: Existing overlay baseline

The existing suite provides head-to-head, weather, car telemetry, fuel, spotter, and multiclass traffic overlays. The owner accepted these six overlays as the completed
baseline, with known fixes tracked separately. No completion date was established.

#### Evidence

The owner explicitly confirmed acceptance during constitution initialization. [README.md](README.md) describes the six overlays and their SSE endpoints;
[dashboard code](src/server/dashboard) and [architecture](docs/architecture.md) show their implementation. Local Git history includes spotter commit `615c779` and traffic
commit `a3370f6`. These records were inspected locally; remote publication was not checked.

## Now

### R-02: Standardize SSE behavior when no player car is available

#### Objective

Define and apply a consistent policy that distinguishes unavailable data from valid empty results. Cover player loss and recovery with integration tests.

Currently, H2H and fuel return `null` and their streams close, spotter and traffic send empty states, and weather and car telemetry continue sending values. The
[broadcaster](src/server/broadcaster.ts) and [dashboard implementations](src/server/dashboard) show these differences. Shared broadcast orchestration already exists, but
it does not resolve this policy difference.

The exact policy, including which data requires a player car and how recovery should behave, remains an owner decision before implementation. No feature specification has
been agreed.

#### Completed when

A consistent policy distinguishes unavailable data from valid empty results, the affected dashboards follow it, and integration tests cover player loss and recovery. The
owner must approve the specific policy before implementation.

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

### R-05: Create a dedicated H2H UI without SimHub

#### Objective

Create a dedicated H2H UI and remove the need for SimHub. Browser dashboards already exist; this outcome is not a first browser UI. The scope of the replacement UI, how
users launch and arrange it, and the effect on existing integrations remain open.

#### Completed when

Not yet defined. The owner must define the replacement UI's scope and what removing SimHub means for existing workflows and distribution.

### R-06: Show average iRating by category

#### Objective

Compute and show average player iRating for each category in a session. Whether to use an existing dashboard or a new one remains open. The
[driver schema](src/schema/driver.schema.ts) already includes individual iRating values, but the requested averages and display are not implemented.

#### Completed when

Not yet defined. The owner must decide which players contribute, how categories and missing ratings are handled, and where the averages appear.
