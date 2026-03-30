export type Driver = {
  carIdx: number;
  name: string;
  carNumber: string;
  car: string;
  iRating: number;
  license: string;
  classEstLapTime: number;
};

export type Car = {
  driver: Driver;
  position: number;
  lastLapTime: number;
  bestLapTime: number;
  lap: number;
};

export type Gap = { value: number; unit: 'seconds' | 'laps'; method: 'est' | 'ref' | 'lap' };

export type Head2Head = {
  sessionTime: number;
  player: Car;
  ahead: Car | null;
  behind: Car | null;
  gapAhead: Gap | null;
  gapBehind: Gap | null;
  deltaAhead: number;
  deltaBehind: number;
  bestRefLapTime: number;
};
