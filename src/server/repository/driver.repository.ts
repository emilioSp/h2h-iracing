// Stores driver repository state when telemetry is refreshed or queried.
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { Driver } from '#schema/driver.schema.ts';

export class DriverRepository {
  private driverMap = new Map<number, Driver>();

  getFilteredRawDrivers = async () => {
    const playerCarIdx = await irsdkRepository.getPlayerCarIdx();

    const rawDrivers = await irsdkRepository.getRawDrivers();
    const player = rawDrivers.find((d) => d.CarIdx === playerCarIdx);

    if (!player) return [];

    return rawDrivers.filter(
      (d) => d.CarIdx > -1 && d.CarClassID === player.CarClassID && !d.CarIsPaceCar,
    );
  };

  private getRacingRawDrivers = async () => {
    const rawDrivers = await irsdkRepository.getRawDrivers();

    return rawDrivers.filter((d) => d.CarIdx > -1 && !d.CarIsPaceCar);
  };

  refreshDriverInfo = async () => {
    this.driverMap = new Map<number, Driver>();

    for (const driver of await this.getRacingRawDrivers()) {
      this.driverMap.set(driver.CarIdx, {
        carIdx: driver.CarIdx,
        name: driver.UserName,
        carNumber: driver.CarNumber,
        car: driver.CarScreenNameShort,
        iRating: Number(driver.IRating ?? 0),
        license: String(driver.LicString ?? ''),
        classEstLapTime: driver.CarClassEstLapTime,
      });
    }

    return this.driverMap;
  };

  getDriverInfo = (carIdx: number): Driver | null => this.driverMap.get(carIdx) ?? null;

  getClassEstLapTime = (carIdx: number): number => this.driverMap.get(carIdx)?.classEstLapTime ?? 0;

  getPlayerClassCarIdx = async (): Promise<number[]> =>
    (await this.getFilteredRawDrivers()).map((d) => d.CarIdx);

  getCarsIdx = async (): Promise<number[]> =>
    (await this.getRacingRawDrivers()).map((d) => d.CarIdx);
}

export default new DriverRepository();
