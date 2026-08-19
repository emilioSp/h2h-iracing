# How the spotter overlap is computed

The spotter overlay shows two vertical bars, one per side. A bar appears only when iRacing
reports a car on that side. The coloured segment inside the bar shows how much that car overlaps
yours.

## What iRacing gives us

| Var | Gives | Missing |
|---|---|---|
| `CarLeftRight` | Which side a car is on | Which car index; no overlap amount |
| `CarIdxLapDistPct` | Per-car track position, as a fraction of a lap | — |
| `CarDistAhead` / `CarDistBehind` | Metres to the nearest car front/back | No side, no car index |
| `DriverInfo.Drivers[]` | Car metadata | No car dimensions |

**There is no overlap percentage in shared memory.** The side is read straight from
`CarLeftRight`; the overlap is derived.

## Step 1 — which side

`CarLeftRight` is an enum:

| Value | Meaning | Bars shown |
|---|---|---|
| `0` off, `1` clear | Nobody alongside | none |
| `2` car left | Left | left |
| `3` car right | Right | right |
| `4` car left and right, `5` two cars left, `6` two cars right | Three wide | both, full height, blinking red/yellow |

## Step 2 — how far ahead or behind the neighbour is

Every car's lap position is a fraction of a lap. Multiply the difference by the track length to
get metres:

```
you   = 51.06%
them  = 51.22%
diff  = 0.16%  ->  0.16% of 5000 m  =  8 m ahead of you
```

Call this `delta`. Positive means the other car is ahead of you.

### The start/finish line

Lap position is a loop: `0%` and `100%` are the same point on track. Two cars straddling the line
read something like `0.9999` and `0.0001`, and plain subtraction reports `-0.9998` — nearly a full
lap apart instead of the real 1 m. Any difference larger than half a lap has wrapped, so the code
shifts it by one lap and takes the short way round:

```ts
let diff = otherDriverPct - playerPct;
if (diff > 0.5) diff -= 1;
if (diff < -0.5) diff += 1;
```

Without this the overlay would blank out exactly when it matters most — dragging someone to the
line.

### Picking the neighbour

Candidates are every car on track except yours, excluding anyone on pit road. The nearest one
wins. All classes count — in multiclass racing the car alongside you is often not in your class.

There is deliberately no distance cut-off. `CarLeftRight` has already decided that a car is
alongside; the maths here only decides how much of it overlaps. A cut-off could only ever discard
a warning iRacing gave us, and a missed warning costs a driver more than a bar showing too little
overlap. If the nearest car turns out to be far away, the clamp below collapses the segment to
nothing and the bar simply renders empty.

## Step 3 — from delta to overlap

A car is `CAR_LENGTH_METERS` (4.8 m) long. Overlap is simply `carLength - |delta|`:

| `delta` | Overlap |
|---|---|
| `0 m` | doors aligned, 100% |
| `2 m` | 2.8 m, 58% |
| `4.8 m` or more | 0%, they are clear of you |

**The bar is your own car seen from above.** The top is your nose, the bottom is your tail. The
coloured segment marks which part of your car the other car is next to.

```
 delta = 0        delta = +2 m      delta = -2 m
 (side by side)   (they're ahead)   (they're behind)

  ┌───┐            ┌───┐             ┌───┐
  │███│ nose       │███│             │   │
  │███│            │███│             │   │
  │███│            │   │             │███│
  │███│ tail       │   │             │███│
  └───┘            └───┘             └───┘
```

`overlapStartPct` and `overlapEndPct` are the bottom and top of that segment, as percentages of
the bar — `0` at your tail, `100` at your nose:

```
deltaPct        = (delta / L) * 100
overlapStartPct = clampPct(deltaPct)
overlapEndPct   = clampPct(100 + deltaPct)
```

`clampPct` keeps both ends on your own car. A neighbour more than one car length ahead would
otherwise produce an `overlapStartPct` past your nose (and a negative segment height); clamping
collapses both ends onto the same point instead. Since candidates are not distance-filtered, this
is also what turns a far-away nearest car into an empty bar rather than nonsense.

The values are percentages rather than `0`–`1` fractions so the overlay can feed them straight
into CSS, and to match the `Pct` convention already used by the weather payload.

When the two are equal the car is alongside but not overlapping — the bar renders, the segment
does not.

## Known limitations

- **Car length is a constant.** iRacing exposes no car dimensions, so a 4.8 m value is used for
  every car. A Formula car and a GT car produce the same bar.
- **Three-wide states cannot use per-car overlap.** Values `4`, `5`, and `6` report one car on
  each side, two cars on the left, or two cars on the right. They do not identify the car indexes.
  `computeSpotter` returns early with `isThreeWide: true` and both sides `null`. It skips the
  neighbour search, and the overlay fills both bars full height. The bars blink red and yellow on
  a 0.6 s cycle.
- **Lap distance follows the track centreline.** Cars side by side through a corner travel arcs of
  slightly different length, so the overlap can be off by a few tenths of a metre mid-corner.
