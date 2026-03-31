# How the Gap Is Calculated

## The Big Picture

We want to answer one question: **how many seconds is car A behind car B?**

iRacing gives us two values for each car:

- **Laps** — how many laps the car has completed (e.g. `5`)
- **LapDistPct** — how far the car is on the current lap, from `0.0` (start) to `1.0` (finish)

## Step 1: Who Is Ahead?

We combine laps and percentage into a single number: **total distance**.

```
total = laps + lapDistPct
```

Example — Monza, lap 5:

| Car | Laps | LapDistPct | Total |
| --- | ---- | ---------- | ----- |
| A   | 5    | 0.30       | 5.30  |
| B   | 5    | 0.50       | 5.50  |

**B has a higher total → B is ahead.**

This works the same way as the race standings. Higher total = further in the race.

## Step 2: How Big Is the Gap?

The gap in "total distance" tells us if the cars are laps apart or within the same lap:

```
gap = |totalA - totalB| = |5.30 - 5.50| = 0.20
```

- If `gap >= 1.0` → the gap is reported in **laps** (e.g. `2 laps`)
- If `gap < 1.0` → the gap is reported in **seconds** (see below)

## Step 3: Converting the Gap to Seconds

We have two methods to convert track distance into time. We pick the best one available.

### Method 1: Reference Lap (preferred)

A **reference lap** is a previously recorded lap. It maps each track position to a time.

Think of it as a lookup table:

```
 0% → 0.0s     (start/finish line)
10% → 9.0s
30% → 27.0s
50% → 45.0s
98% → 88.2s
100% → 90.0s   (back to start/finish line)
```

To find the gap, we look up both positions:

```
timeAhead  = lookup(50%) = 45.0s
timeBehind = lookup(30%) = 27.0s
gap = 45.0 - 27.0 = 18.0s
```

**When it's used:** both cars are on track (not in pits) and the behind car has completed at least 2 laps (so we have a recorded lap to use).

### Method 2: Estimated Time (fallback)

iRacing provides `CarIdxEstTime`, an estimated time for each car's current position on track. We subtract the two values.

**When it's used:** early in the race (less than 2 laps), when a car is in the pits, or when no reference lap is available.

## The Finish-Line Problem

There is one tricky case: when the ahead car has **crossed the finish line** but the behind car hasn't yet.

### Example

Monza, `lapTime = 90s`:

| Car    | Laps | LapDistPct | Total | Time on reference lap |
| ------ | ---- | ---------- | ----- | --------------------- |
| Ahead  | 6    | 0.10       | 6.10  | 9.0s                  |
| Behind | 5    | 0.50       | 5.50  | 45.0s                 |

The ahead car crossed the finish line and is now at 10% of the **next** lap. The behind car is still at 50% of the **previous** lap.

The raw delta would be:

```
delta = 9.0 - 45.0 = -36.0s   ← wrong! The gap can't be negative
```

This happens because the reference lap restarts at 0 after the finish line. The ahead car's time (9s) is small because it just started a new lap, but it's actually **further ahead**, not behind.

### The Fix

We detect this by checking: **is the ahead car's track percentage lower than the behind car's?**

```
aheadPct (0.10) < behindPct (0.50) → yes → the ahead car crossed the finish line
```

When this happens, we add one full lap time to the delta:

```
delta = -36.0 + 90.0 = 54.0s   ← correct!
```

This makes sense: the behind car needs to travel from 50% to the finish (45s) and then from 0% to 10% (9s) = **54 seconds**.

### Why `aheadPct < behindPct` Works

If the ahead car has **not** crossed the finish line, it's further along the track, so `aheadPct > behindPct`. The delta is positive and correct.

If the ahead car **has** crossed the finish line, its percentage resets to a low value, so `aheadPct < behindPct`. The delta is negative and needs correction.

## Summary

```
1. total = laps + lapDistPct           → who is ahead
2. |totalA - totalB| >= 1.0            → gap in laps
3. |totalA - totalB| < 1.0             → gap in seconds:
   a. Use reference lap if available
   b. Fall back to estimated time
   c. Correct for finish-line crossing
```

