// Compares class pace when selecting faster traffic behind the player.

// iRacing reports every car of a mixed AI field as one class, so CarClassID and
// CarClassRelSpeed cannot order them. Only the estimated lap time separates a
// real class from the spread inside one: at Mugello the faster classes are
// 8.6-11.3 s quicker, while the GT3 cars differ by 0.6 s at most.
export const FASTER_CLASS_MARGIN_SECONDS = 5;

type IsFasterCarInput = {
  carClassEstLapTime: number;
  playerClassEstLapTime: number;
};

export const isFasterCar = ({
  carClassEstLapTime,
  playerClassEstLapTime,
}: IsFasterCarInput): boolean =>
  carClassEstLapTime > 0 &&
  carClassEstLapTime <= playerClassEstLapTime - FASTER_CLASS_MARGIN_SECONDS;
