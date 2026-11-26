---
type: ADR
id: 'ADR-003'
title: 'Separate backend responsibilities by layer'
status: active
---

## Context

Each dashboard combines simulator data with calculations and sends the result to browser clients. The backend separates these responsibilities.

## Decision

- **Routers:** Open SSE connections.
- **Broadcaster:** Manage subscriptions and deliver updates.
- **Dashboards:** Assemble payloads.
- **Services:** Perform calculations.
- **Repositories:** Read telemetry and store in-memory data.

## Consequences

- Dashboards can share telemetry access and calculations without putting that logic in route handlers.
- Pure calculation helpers can be tested separately from fixture-backed feature flows.
- Services can read repositories directly; not every service needs to be a pure function.
