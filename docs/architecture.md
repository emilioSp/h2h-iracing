# Architecture Overview

Real-time racing overlay for iRacing. A local Node.js server reads telemetry from the iRacing simulator and pushes live updates to browser-based overlays running inside OBS or SimHub.

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        iRacing (Simulator)                      │
│                       Windows Shared Memory                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │ @emiliosp/node-iracing-sdk
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js Server  (Hono)                       │
│                                                                 │
│   ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐   │
│   │ Repository  │   │   Service    │   │     Dashboard      │   │
│   └─────────────┘   └──────────────┘   └──────────┬─────────┘   │
│                                                   │             │
│                         tick.ts (33 ms poll) ───▶ │             │
│                                                   ▼             │
│                                          ┌─────────────────┐    │
│                                          │  Broadcaster    │    │
│                                          │  (SSE clients)  │    │
│                                          └────────┬────────┘    │
│                                                   │             │
│              ┌────────────────────────────────────┤             │
│              │                │                   │             │
│   GET /sse/h2h  GET /sse/weather  GET /sse/car  GET /sse/fuel   │
│              │                │                   │             │
│             (serves static React builds from /dist/)            │
└──────────────┼────────────────┼───────────────────┼───────────────┼──┘
               │                │                   │               │
               │         SSE (Server-Sent Events)                   │
               │                │                   │               │
┌──────────────▼────────────────▼───────────────────▼───────────────▼──┐
│                    OBS Browser Source / SimHub                       │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  ┌─────────┐  │
│  │ H2H Overlay │  │   Weather   │  │  Car Telemetry  │  │  Fuel   │  │
│  │  (React)    │  │   (React)   │  │    (React)      │  │ (React) │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  └─────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Layers

### Router
Thin Hono route handlers. Each route (`/sse/h2h`, `/sse/weather`, `/sse/car`, `/sse/fuel`) opens an SSE stream and registers the client with the broadcaster.

### Broadcaster
Manages the set of connected SSE clients. On each tick (~33 ms), it calls all three dashboards and writes the results to every subscribed client. The loop only runs while at least one client is connected.

### Dashboard (service orchestrator)
Aggregates repository + service output into a typed payload per overlay. One dashboard per overlay type: `head2head`, `weather`, `car-telemetry`, `fuel`.

### Service
Pure business logic. Computes standings from track position, calculates time/lap gaps between cars using a reference lap, and derives delta times.

### Repository
Wraps the iRacing SDK. Reads raw telemetry values from shared memory (speed, lap times, positions, weather, car settings). Also supports a mock mode for development without the simulator running.

---

## Data Flow

1. **tick.ts** fires every 33 ms and refreshes in-memory telemetry from the iRacing SDK.
2. **Broadcaster** calls each dashboard to compute the latest payload.
3. **Payloads** are serialized as JSON and written to all connected SSE clients.
4. **React overlays** receive the event, parse the JSON, and re-render.

---
