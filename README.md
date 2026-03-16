# h2h-iracing

Real-time head-to-head battle overlay for iRacing. Tracks your position relative to the cars immediately ahead and behind you, showing gaps, deltas, and driver info.

Two modes of operation:
- **Server** — HTTP + WebSocket server for browser overlays
- **CLI** — terminal UI for local monitoring

## Prerequisites

- Node.js 24+
- iRacing running on Windows (for live mode)

## Local development setup

Environment variables:

| Variable           | Description                                  | Default |
|--------------------|----------------------------------------------|---------|
| `DATA_MODE`        | `live` (iRacing SDK) or `mock` (dump file)   | —       |
| `DUMP_FILE_PATH`   | Path to `.bin` dump file used in mock mode   | —       |
| `POLL_INTERVAL_MS` | Telemetry polling interval in milliseconds   | —       |
| `PORT`             | HTTP server port                             | —       |
| `LOG_LEVEL`        | `debug` / `info` / `warn` / `error`          | —       |

Start in mock mode (no iRacing required):

```bash
# HTTP + WebSocket server
npm run server:dev:mock

# Terminal UI
npm run cli:dev:mock
```

Start in live mode (iRacing must be running):

```bash
npm run server:start
npm run cli:start
```

## API

### `GET /api/battle`

Returns the current battle state.

**Response `200`**
```json
{
  "data": {
    "sessionTime": 1234.5,
    "player":  { "position": 3, "driver": { "name": "...", ... }, "gapAhead": -1.23, ... },
    "ahead":   { ... } | null,
    "behind":  { ... } | null,
    "gapAhead": -1.234,
    "gapBehind": 2.567,
    "deltaAhead": -0.456,
    "deltaBehind": 0.789
  }
}
```

**Response `503`** — no active race session.

### `GET /ws`

WebSocket endpoint. Pushes the same `{ data: BattleState }` payload at every poll interval.

## Testing

```bash
npm test
```
Tests run against a real telemetry dump file (`DUMP_FILE_PATH`).