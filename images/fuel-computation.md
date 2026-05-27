# How Fuel Computation Works

The fuel dashboard computes how much fuel to add at the next pit stop so the player can finish the race. All values are recalculated every poll interval.

## 1. Fuel Tracking

At every lap boundary the repository records `{ lapNumber, fuelAtLapStart }` into a sliding window of the last **5 laps** (`FUEL_SAMPLE_WINDOW`).

Source: `src/server/repository/fuel.repository.ts`

## 2. Median Fuel Per Lap

From consecutive window samples, fuel deltas are computed:

```
delta[i] = fuelAtLapStart[i] - fuelAtLapStart[i+1]
```

Negative deltas (pit stop refuels) are discarded. The **median** of the remaining positive deltas is used as `medianFuelPerLap`. Median is preferred over mean to absorb outlier laps (safety car, anomalous stints).

## 3. Estimated Time Remaining (only timed races are support)

The race is timed. The clock shows how much time is left, but when the clock hits zero the current lap still has to be completed. The computation uses the **leader's position** to determine when the race actually ends for the player.

```
leaderTimeToFinishCurrentLap = (1 - leaderLapDistPct) * leaderMedianLapTime
leaderTimeAtNextSFCrossing   = timeRemaining - leaderTimeToFinishCurrentLap

if leaderTimeAtNextSFCrossing >= 0:
  remainingLaps = floor(leaderTimeAtNextSFCrossing / leaderMedianLapTime) + 1  # +1 = white flag lap
else:
  remainingLaps = 0  # time expires during the current lap — this IS the white flag lap

estimatedTimeRemaining = leaderTimeToFinishCurrentLap + remainingLaps * leaderMedianLapTime
```

Returns `0` when the checkered flag is out. Returns `null` if lap times are not yet available.

Source: `src/server/service/fuel.service.ts → computeEstimatedTimeRemaining()`

## 4. Leader Detection

In a **race session**, the leader is the car with the highest `lapsCompleted + lapDistPct`. In **practice/qualifying**, the player is treated as the leader.

Source: `src/server/dashboard/fuel.dashboard.ts → getLeaderCarIdx()`

## 5. Laps Remaining (fractional)

```
lapsRemaining = ceil(playerLapDistPct + estimatedTimeRemaining / playerMedianLapTime) - playerLapDistPct
```

This is intentionally a fractional number — it represents the exact lap-distance the player still has to cover, not a rounded lap count. The fuel calculation consumes this value directly.

Source: `src/server/dashboard/fuel.dashboard.ts → computeLapsRemaining()`

## 6. Fuel Refill Amounts

```
fuelToFinishRace = lapsRemaining * medianFuelPerLap

refillNoMargin       = max(0, fuelToFinishRace - fuelLevel)
refillHalfLapMargin  = max(0, fuelToFinishRace - fuelLevel + 0.5 * medianFuelPerLap)
refill1LapMargin     = max(0, fuelToFinishRace - fuelLevel + 1.0 * medianFuelPerLap)
```

Three variants give the driver a choice between running lean and adding a safety buffer of half or one full lap of fuel.

Source: `src/server/service/fuel.service.ts → computeFuelRefill()`

## Edge Cases

| Situation | Behavior |
|---|---|
| Pit stop during sample window | Negative delta filtered out; does not corrupt median |
| Fewer than 2 fuel samples | `medianFuelPerLap` is `null`; refill values are `null` |
| Checkered flag | `estimatedTimeRemaining = 0`; refill = whatever is needed to finish the current lap |
| Practice / qualifying | Refill values are `null` (no race context) |
| Player not found | Entire computation returns `null` |
