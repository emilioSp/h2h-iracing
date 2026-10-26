# Architecture Decision Records

These records capture architectural choices explicitly accepted by the owner during constitution initialization. All three are implemented in the current repository.
Original decision dates and historical reasons were not established; acceptance here does not imply an earlier approval date.

The records describe the existing architecture, not permission for future implementation. See [architecture](docs/architecture.md) for the system diagram and
[roadmap](ROADMAP.md) for planned work.

## ADR-001: Use a local backend with browser overlays

### Status

Accepted by the owner during constitution initialization. Implemented.

### Context

H2H needs to read iRacing telemetry and present information in overlays while the driver races. Live simulator telemetry comes from Windows shared memory through the
iRacing SDK. Existing browser overlays run in SimHub or OBS.

### Decision

Use a local Node.js backend to read telemetry and compute dashboard data. Use React browser overlays to display that data. The HTTP server currently listens on
`127.0.0.1`.

### Consequences

Telemetry access and dashboard computation stay in the backend rather than the browser. Browser hosts can display separate dashboards from the same local service. Live
telemetry requires iRacing running on Windows; development can read binary dumps without a live simulator.

The existing SimHub integration is current behavior, not a permanent requirement. A dedicated UI without SimHub is an uncommitted Later outcome in
[R-05](ROADMAP.md#r-05-create-a-dedicated-h2h-ui-without-simhub).

### Evidence

The owner explicitly approved this record during constitution initialization. Repository evidence: [architecture](docs/architecture.md),
[HTTP server](src/server/server.ts), [SDK repository](src/server/repository/irsdk.repository.ts), and [React dashboard](src/h2h-dashboard/src/App.tsx). These establish
current implementation, not the original historical rationale.

## ADR-002: Push SSE updates with demand-driven polling

### Status

Accepted by the owner during constitution initialization. Implemented.

### Context

Multiple overlays need updated dashboard data from one telemetry source. Each overlay subscribes to its own SSE route, while the backend coordinates telemetry refresh and
dashboard computation.

### Decision

Use Server-Sent Events to push JSON dashboard payloads to subscribed overlays. Keep a shared broadcaster with client sets per dashboard. Run the polling loop while
clients are connected and stop it when no subscribers remain or iRacing is disconnected.

### Consequences

One loop refreshes telemetry for the connected overlays, and only subscribed dashboards are computed for broadcast. The update interval is configured through
`POLL_INTERVAL_MS`; work is scheduled with `setTimeout` after a broadcast completes, so it is not a fixed delivery-rate guarantee.

SSE provides a server-to-browser data stream. Disconnects close existing streams, and the browser dashboards contain reconnection handling. Missing-player behavior is
still inconsistent across dashboards; [R-02](ROADMAP.md#r-02-standardize-sse-behavior-when-no-player-car-is-available) records the planned policy work without selecting a
new policy.

### Evidence

The owner explicitly approved this record during constitution initialization. Repository evidence: [architecture](docs/architecture.md),
[broadcaster](src/server/broadcaster.ts), [telemetry tick](src/server/tick.ts), [H2H route](src/server/router/h2h.router.ts), and
[browser subscription](src/h2h-dashboard/src/App.tsx). These establish current implementation, not the original historical rationale.

## ADR-003: Separate backend responsibilities by layer

### Status

Accepted by the owner during constitution initialization. Implemented.

### Context

Each dashboard combines simulator data with calculations and exposes the result to browser clients. Telemetry access, calculations, payload assembly, and connection
handling are separate responsibilities in the existing backend.

### Decision

Keep routers responsible for SSE connections, the broadcaster responsible for subscriptions and delivery, dashboards responsible for payload orchestration, services
responsible for computations, and repositories responsible for telemetry access and in-memory data.

### Consequences

Dashboards can share telemetry access and computation code without putting those responsibilities in route handlers. Pure calculation helpers can be tested separately,
while fixture-backed tests exercise feature flows. Existing services can read repositories directly; the layers do not imply that every service is a pure function.

### Evidence

The owner explicitly approved this record during constitution initialization. Repository evidence: [architecture](docs/architecture.md), [routers](src/server/router),
[broadcaster](src/server/broadcaster.ts), [dashboards](src/server/dashboard), [services](src/server/service), and [repositories](src/server/repository). These establish
current implementation, not the original historical rationale.
