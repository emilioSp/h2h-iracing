import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockIr = vi.hoisted(() => ({
  isConnected: vi.fn(),
  get: vi.fn(),
  getSessionInfo: vi.fn(),
  shutdown: vi.fn(),
  refreshSharedMemory: vi.fn(),
}));

vi.mock('@emiliosp/node-iracing-sdk', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@emiliosp/node-iracing-sdk')>();
  return {
    ...actual,
    IRSDK: {
      fromDump: vi.fn().mockReturnValue(mockIr),
      connect: vi.fn().mockResolvedValue(mockIr),
    },
  };
});

import { VARS } from '@emiliosp/node-iracing-sdk';
import { computeCarTelemetry } from '#server/dashboard/car-telemetry.dashboard.ts';

beforeEach(() => {
  vi.clearAllMocks();
  mockIr.isConnected.mockReturnValue(true);
  mockIr.get.mockReturnValue([0]);
});

describe('computeCarTelemetry', () => {
  it('assembles car telemetry from SDK values', async () => {
    mockIr.get.mockImplementation((varName: string) => {
      const values: Record<string, unknown[]> = {
        [VARS.DC_ABS]: [4],
        [VARS.DC_TRACTION_CONTROL]: [2],
        [VARS.BRAKE_ABS_ACTIVE]: [true],
        [VARS.DC_TRACTION_CONTROL_TOGGLE]: [false],
        [VARS.DC_BRAKE_BIAS]: [0.543],
        [VARS.DC_PIT_SPEED_LIMITER_TOGGLE]: [false],
      };
      return values[varName] ?? [0];
    });

    const car = await computeCarTelemetry();

    expect(car).toEqual({
      abs: 4,
      tc: 2,
      isAbsActive: true,
      isTcActive: false,
      brakeBias: 0.543,
      isPitSpeedLimiterActive: false,
    });
  });

  it('defaults to 0 / false when SDK returns nothing', async () => {
    mockIr.get.mockReturnValue([]);

    const car = await computeCarTelemetry();

    expect(car).toEqual({
      abs: 0,
      tc: 0,
      isAbsActive: false,
      isTcActive: false,
      brakeBias: 0,
      isPitSpeedLimiterActive: false,
    });
  });
});
