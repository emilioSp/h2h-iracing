---
type: Roadmap
id: 'R-02'
title: 'Standardize SSE behavior when no player car is available'
status: completed
---

## Objective

Use one connection policy across all six overlays when there is no usable player car. Keep the existing welcome and reconnect behavior. Temporary missing-player gaps and
recovery on the same stream are out of scope.

See the [specification](../../.specs/20261026-143309-r-02-distinguish-sse-disconnection-unavailable-data-and-available-data/spec.md).

## Completed When

A disconnected simulator or a missing or negative player index closes every SSE stream and clears tracking history. Valid empty results and nullable calculation fields
are still delivered as normal data.
