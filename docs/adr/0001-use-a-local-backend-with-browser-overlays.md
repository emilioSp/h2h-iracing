---
type: ADR
id: 'ADR-001'
title: 'Use a local backend with browser overlays'
status: active
---

## Context

- H2H shows iRacing telemetry to the driver while racing.
- The iRacing SDK reads live telemetry from Windows shared memory.
- SimHub and OBS can host the browser overlays.

## Decision

- Use a local Node.js backend to read telemetry and compute dashboard data. Its HTTP server listens on `127.0.0.1`.
- Use React browser overlays to display the dashboard data.

## Consequences

- Telemetry access and dashboard calculations stay in the backend.
- Browser hosts can display separate dashboards from the same local service.
- Live telemetry requires iRacing on Windows. Development can use binary dumps instead.
- SimHub support is not a permanent requirement. A dedicated UI without SimHub is tracked in [R-05](../roadmap/r-05-create-a-dedicated-h2h-ui-without-simhub.md).
