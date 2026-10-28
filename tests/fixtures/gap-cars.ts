// Supplies three indexed cars when race gap tests arrange the player and neighbours.
import type { Car } from '#schema/car.schema.ts';

export const gapCars: Car[] = [
  {
    driver: {
      carIdx: 0,
      name: '',
      carNumber: '',
      car: '',
      iRating: 0,
      license: '',
      classEstLapTime: 0,
    },
    position: 0,
    lastLapTime: 0,
    bestLapTime: 0,
    lap: 0,
  },
  {
    driver: {
      carIdx: 1,
      name: '',
      carNumber: '',
      car: '',
      iRating: 0,
      license: '',
      classEstLapTime: 0,
    },
    position: 0,
    lastLapTime: 0,
    bestLapTime: 0,
    lap: 0,
  },
  {
    driver: {
      carIdx: 2,
      name: '',
      carNumber: '',
      car: '',
      iRating: 0,
      license: '',
      classEstLapTime: 0,
    },
    position: 0,
    lastLapTime: 0,
    bestLapTime: 0,
    lap: 0,
  },
];
