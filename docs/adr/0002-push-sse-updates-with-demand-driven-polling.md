---
type: ADR
id: 'ADR-002'
title: 'Push SSE updates with demand-driven polling'
status: active
---

## Context

Multiple overlays need fresh dashboard data from one telemetry source. The backend coordinates telemetry refresh and dashboard calculations.

## Decision

- Push JSON updates through a separate Server-Sent Events (SSE) route for each overlay.
- Use one broadcaster that tracks subscribers by dashboard.
- Run the polling loop while clients are connected. Stop it when no subscribers remain or iRacing disconnects.

## Consequences

- One loop refreshes telemetry and computes updates only for dashboards with subscribers.
- `POLL_INTERVAL_MS` sets the delay after each broadcast, not a guaranteed delivery rate.
- The browser dashboards handle reconnection when their server-to-browser streams close.
- A simulator disconnect or a missing or negative player index closes every stream and clears tracking history across all six dashboards. See
  [R-02](../roadmap/r-02-standardize-sse-behavior-when-no-player-car-is-available.md) and [PR #79](https://github.com/emilioSp/h2h-iracing/pull/79).
