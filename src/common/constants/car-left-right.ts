// Defines iRacing side-by-side states when the spotter interprets telemetry.
export const CAR_LEFT_RIGHT = {
  OFF: 0,
  CLEAR: 1,
  CAR_LEFT: 2,
  CAR_RIGHT: 3,
  CAR_LEFT_AND_RIGHT: 4,
  TWO_CARS_LEFT: 5,
  TWO_CARS_RIGHT: 6,
} as const;
