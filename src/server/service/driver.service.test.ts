import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as irsdkRepo from '#repository/irsdk.repository.ts';
import {
  getCarIdxs,
  getClassEstLapTime,
  getDriverInfo,
  getFilteredRawDrivers,
  refreshDriverInfo,
} from '#service/driver.service.ts';

const makeRawDriver = (
  overrides: Partial<{
    CarIdx: number;
    CarClassID: number;
    CarIsPaceCar: number;
    UserName: string;
    CarNumber: string;
    CarScreenNameShort: string;
    IRating: string;
    LicString: string;
    CarClassEstLapTime: number;
  }> = {},
) => ({
  CarIdx: 1,
  CarClassID: 100,
  CarIsPaceCar: 0,
  UserName: 'Driver One',
  CarNumber: '1',
  CarScreenNameShort: 'GT3 Car',
  IRating: '2000',
  LicString: 'A 4.00',
  CarClassEstLapTime: 90.0,
  ...overrides,
}) as unknown as ReturnType<typeof irsdkRepo.getRawDrivers>[number];

describe('driver.service', () => {
  describe('getFilteredRawDrivers', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('returns only drivers of the same car class as the player (including player)', () => {
      vi.spyOn(irsdkRepo, 'getPlayerCarIdx').mockReturnValue(1);
      vi.spyOn(irsdkRepo, 'getRawDrivers').mockReturnValue([
        makeRawDriver({ CarIdx: 1, CarClassID: 100, UserName: 'Player' }),
        makeRawDriver({ CarIdx: 2, CarClassID: 100, UserName: 'Same Class' }),
        makeRawDriver({ CarIdx: 3, CarClassID: 200, UserName: 'Other Class' }),
      ]);

      const result = getFilteredRawDrivers();

      expect(result).toHaveLength(2);
      expect(result.map((d) => d.UserName)).toEqual(['Player', 'Same Class']);
      expect(result.some((d) => d.UserName === 'Other Class')).toBe(false);
    });

    it('excludes drivers with CarIdx === 0', () => {
      vi.spyOn(irsdkRepo, 'getPlayerCarIdx').mockReturnValue(1);
      vi.spyOn(irsdkRepo, 'getRawDrivers').mockReturnValue([
        makeRawDriver({ CarIdx: 1, CarClassID: 100 }), // player
        makeRawDriver({ CarIdx: 0, CarClassID: 100, UserName: 'Slot Zero' }),
        makeRawDriver({ CarIdx: 2, CarClassID: 100, UserName: 'Valid Driver' }),
      ]);

      const result = getFilteredRawDrivers();

      expect(result.every((d) => d.CarIdx > 0)).toBe(true);
      expect(result.some((d) => d.UserName === 'Slot Zero')).toBe(false);
    });

    it('excludes pace cars', () => {
      vi.spyOn(irsdkRepo, 'getPlayerCarIdx').mockReturnValue(1);
      vi.spyOn(irsdkRepo, 'getRawDrivers').mockReturnValue([
        makeRawDriver({ CarIdx: 1, CarClassID: 100 }), // player
        makeRawDriver({ CarIdx: 2, CarClassID: 100, CarIsPaceCar: 1, UserName: 'Pace Car' }),
        makeRawDriver({ CarIdx: 3, CarClassID: 100, UserName: 'Racer' }),
      ]);

      const result = getFilteredRawDrivers();

      expect(result.every((d) => !d.CarIsPaceCar)).toBe(true);
      expect(result.some((d) => d.UserName === 'Pace Car')).toBe(false);
    });

    it('returns only the player when no other drivers share the player class', () => {
      vi.spyOn(irsdkRepo, 'getPlayerCarIdx').mockReturnValue(1);
      vi.spyOn(irsdkRepo, 'getRawDrivers').mockReturnValue([
        makeRawDriver({ CarIdx: 1, CarClassID: 100, UserName: 'Player' }),
        makeRawDriver({ CarIdx: 2, CarClassID: 200, UserName: 'Prototype Driver' }),
      ]);

      const result = getFilteredRawDrivers();

      expect(result).toHaveLength(1);
      expect(result[0].UserName).toBe('Player');
    });
  });

  describe('refreshDriverInfo / getDriverInfo / getClassEstLapTime', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      vi.spyOn(irsdkRepo, 'getPlayerCarIdx').mockReturnValue(10);
      vi.spyOn(irsdkRepo, 'getRawDrivers').mockReturnValue([
        makeRawDriver({ CarIdx: 10, CarClassID: 100, UserName: 'Player' }), // player
        makeRawDriver({
          CarIdx: 5,
          CarClassID: 100,
          UserName: 'Alice',
          CarNumber: '42',
          CarScreenNameShort: 'GT3 Car',
          IRating: '3500',
          LicString: 'A 4.50',
          CarClassEstLapTime: 88.5,
        }),
      ]);
      refreshDriverInfo();
    });

    it('getDriverInfo returns correct driver data after refresh', () => {
      const driver = getDriverInfo(5);

      expect(driver).not.toBeNull();
      expect(driver?.carIdx).toBe(5);
      expect(driver?.name).toBe('Alice');
      expect(driver?.carNumber).toBe('42');
      expect(driver?.iRating).toBe(3000); // DATA_MODE=mock forces 3000
      expect(driver?.license).toBe('A 4.50');
      expect(driver?.classEstLapTime).toBe(88.5);
    });

    it('getDriverInfo returns null for unknown carIdx', () => {
      expect(getDriverInfo(99)).toBeNull();
    });

    it('getClassEstLapTime returns the lap time for a known driver', () => {
      expect(getClassEstLapTime(5)).toBe(88.5);
    });

    it('getClassEstLapTime returns 0 for unknown carIdx', () => {
      expect(getClassEstLapTime(99)).toBe(0);
    });
  });

  describe('getCarIdxs', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('returns car indices of filtered drivers', () => {
      vi.spyOn(irsdkRepo, 'getPlayerCarIdx').mockReturnValue(1);
      vi.spyOn(irsdkRepo, 'getRawDrivers').mockReturnValue([
        makeRawDriver({ CarIdx: 1, CarClassID: 100 }), // player
        makeRawDriver({ CarIdx: 2, CarClassID: 100 }),
        makeRawDriver({ CarIdx: 3, CarClassID: 100 }),
        makeRawDriver({ CarIdx: 4, CarClassID: 200 }), // other class
      ]);

      expect(getCarIdxs()).toEqual([1, 2, 3]);
    });
  });

  describe('integration against dump data', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('getFilteredRawDrivers returns only same-class non-pace-car drivers with valid CarIdx', () => {
      const result = getFilteredRawDrivers();

      expect(result.every((d) => d.CarIdx > 0)).toBe(true);
      expect(result.every((d) => !d.CarIsPaceCar)).toBe(true);

      if (result.length > 0) {
        const classId = result[0].CarClassID;
        expect(result.every((d) => d.CarClassID === classId)).toBe(true);
      }
    });

    it('refreshDriverInfo builds a map consistent with getFilteredRawDrivers', () => {
      const filtered = getFilteredRawDrivers();
      refreshDriverInfo();

      for (const raw of filtered) {
        const driver = getDriverInfo(raw.CarIdx);
        expect(driver).not.toBeNull();
        expect(driver?.carIdx).toBe(raw.CarIdx);
        expect(driver?.name).toBe(raw.UserName);
      }
    });
  });
});