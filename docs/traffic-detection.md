# How Traffic Is Detected

## The Big Picture

We want to answer one question: **which faster cars are about to arrive from behind?**

In multiclass racing this is the whole job of a slower-class driver. You need to know what is
coming and how long you have, so you can pick a safe place to let it by. The spotter overlay is too
late — by then the car is already alongside.

The overlay shows a car when three things are true:

1. it belongs to a **faster class**,
2. it is **behind** you on track,
3. it is within **2 seconds** of you.

## Step 1: Which Cars Are Faster?

This is the hard part, and the obvious answer does not work.

iRacing gives each driver a `CarClassID`, a `CarClassRelSpeed` and a `CarClassShortName`. In a real
multiclass event these separate the classes. In many sessions they do not.

Here is a real race dump from Mugello with twelve cars — Hypercars, an LMP2, five GT3s, a Porsche
Cup and a GT4:

| Field | Value for all twelve cars |
| ----- | ------------------------- |
| `CarClassID` | `0` |
| `CarClassRelSpeed` | `100` |
| `CarClassShortName` | `null` |
| `CarIdxClass` | `0` |

iRacing put every one of them in the same class. Any rule built on those fields matches nothing.

Only `CarClassEstLapTime` tells the cars apart, and it varies by **car model** rather than by class:

| Car | Estimated lap | vs the player's GT3 |
| --- | ------------- | ------------------- |
| Acura ARX-06 | 91.93 s | 11.3 s faster |
| Ferrari 499P | 92.10 s | 11.1 s faster |
| Porsche 963 | 92.25 s | 10.9 s faster |
| Dallara P217 LMP2 | 94.58 s | 8.6 s faster |
| AMR Vantage GT3 EVO | 102.55 s | 0.6 s faster |
| Porsche 911 GT3 R | 103.19 s | the same |
| **Ferrari 296 GT3 (player)** | **103.20 s** | — |
| Porsche 911 Cup | 106.32 s | slower |
| Ford Mustang GT4 | 114.56 s | slower |

Lap time alone is still not enough. The Vantage is 0.6 s quicker than the player's Ferrari, but it
is the same class of car — warning about it would be noise.

### The Rule

A car counts as faster when its estimated lap is at least **5 seconds** quicker:

```
carClassEstLapTime <= playerClassEstLapTime - FASTER_CLASS_MARGIN_SECONDS
```

The margin is what separates a real class from the spread inside one. In the table above the
genuinely faster cars are 8.6 s to 11.3 s quicker, while the GT3 cars differ by 0.6 s at most.

The margin also handles a case that trips up speed-based rules. A Porsche Cup car is quicker than a
GT3 down a straight, but it is 3 s slower over a lap and is never going to come past. Because the
rule compares lap times and not speed, the Cup car is correctly ignored.

A car with no estimated lap time (`0`) is never treated as faster. A missing value should cost one
missed warning, not produce an overlay that is permanently on screen.

## Step 2: Is the Car Behind?

Lap position is a loop, so a raw subtraction breaks across the start/finish line. Two cars a metre
apart across the line read `0.999` and `0.001`.

`wrapLapDelta` in `src/server/utils/track-position.ts` takes the short way round and returns a
signed distance between `-0.5` and `0.5`:

```
wrapLapDelta(playerPct - carPct) >= 0   -> the car is behind you
```

The spotter overlay uses the same helper.

## Step 3: How Many Seconds Behind?

This reuses the ladder described in [How the gap is calculated](gap-calculation.md), with the
player as the car ahead:

1. **Reference lap** — if we have recorded a lap for that car, and it has completed at least two
   laps, and neither car is on pit road, we look up the time at both track positions and subtract.
2. **Estimated time** — otherwise we fall back to the car's class lap time multiplied by the
   distance between you.

Reference laps used to be recorded only for cars in the player's own class. They are now recorded
for every car on track, which is what makes an accurate cross-class gap possible. The collection
runs once per tick from `tick.ts`, and only during a race.

Cars further away than 2 seconds are dropped. The rest are sorted with the nearest first.

## Step 4: Naming the Class

`CarClassShortName` is empty in many sessions, so the label comes from the car model name. The
first pattern that matches wins:

| Pattern | Label | Example |
| ------- | ----- | ------- |
| `Cup` | PCUP | Porsche 911 Cup (992.2) |
| `GT3` | GT3 | Ferrari 296 GT3 |
| `GT4` | GT4 | Ford Mustang GT4 |
| `F3` | F3 | Dallara F3 |
| `GTE` | GTE | Ford GT GTE |
| `GT1` | GT1 | Aston Martin DBR9 GT1 |
| `LMP2` | LMP2 | Dallara P217 LMP2 |
| nothing matches | GTP | Acura ARX-06, Ferrari 499P, Porsche 963 |

Two details matter here.

Each pattern is matched on a word boundary, so `Ferrari GT30000` is not a GT3.

`Cup` is tested before `GT3` because iRacing names some Cup cars "Porsche 911 GT3 Cup". Testing
`GT3` first would label them GT3. Testing `Cup` first gets both right, because "Porsche 911 GT3 R"
contains no "Cup".

Results are cached by car name. The name never changes, so the cache never needs clearing.

## Where the Row Appears

The overlay is 500x200 pixels and transparent. A row's height on screen is its gap:

```
top = (gapSeconds / TRAFFIC_WINDOW_SECONDS) * (200 - ROW_HEIGHT)
```

A car right on your bumper pins to the top; a car 2 seconds back sits at the bottom. As it closes,
the row slides up.

Rows are never pushed apart. Two rows on top of each other means two cars arriving together, which
is exactly the situation worth knowing about. The nearest car is drawn on top, so the row you need
first is always the readable one.

Before a session starts the overlay shows the welcome page, the same as the opaque dashboards, so
you can see it is alive. Once the session is live it goes back to being invisible until a faster
car closes in.

## Summary

```
1. carClassEstLapTime <= playerEst - 5s   -> the car is faster
2. wrapLapDelta(playerPct - carPct) >= 0  -> the car is behind
3. gap in seconds:
   a. use the reference lap when there is one
   b. otherwise use the estimated time
4. keep gaps <= 2s, nearest first
```

## Known Limitations

- The class label is a guess from the car model name. A model whose name carries no class marker
  falls back to GTP.
- Cars in the pits are excluded, and the overlay hides itself while you are on pit road.
- Recording reference laps for every car costs more memory than recording them for one class. A
  60-car field holds roughly six laps of about 580 points per car.
