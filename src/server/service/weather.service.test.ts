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

import { SESSION_DATA_KEYS, VARS } from '@emiliosp/node-iracing-sdk';
import { computeWeather } from '#service/weather.service.ts';

beforeEach(() => {
  vi.clearAllMocks();
  mockIr.isConnected.mockReturnValue(true);
  mockIr.get.mockReturnValue([0]);
});

describe('computeWeather', () => {
  it('assembles weather from SDK telemetry values', async () => {
    mockIr.get.mockImplementation((varName: string) => {
      const values: Record<string, number[]> = {
        [VARS.AIR_TEMP]: [22.5],
        [VARS.TRACK_TEMP_CREW]: [35.0],
        [VARS.TRACK_WETNESS]: [1], // Dry
        [VARS.PRECIPITATION]: [0],
        [VARS.WIND_DIR]: [0],
        [VARS.WIND_VEL]: [5.0],
        [VARS.YAW_NORTH]: [Math.PI],
        [VARS.SESSION_TIME_OF_DAY]: [43200],
      };
      return values[varName] ?? [0];
    });
    mockIr.getSessionInfo.mockImplementation(
      (varName: string): Record<string, Record<string, string>> => {
        const values: Record<string, Record<string, Record<string, string>>> = {
          [SESSION_DATA_KEYS.WEEKEND_INFO]: {
            WeekendOptions: {
              RelativeHumidity: '60.6 %',
            },
          },
        };

        return values[varName] ?? [0];
      },
    );

    const weather = await computeWeather();

    expect(weather).toEqual({
      airTemperatureC: 22.5,
      trackTemperatureC: 35.0,
      relativeHumidityPct: 60.6,
      precipitationPct: 0,
      trackWetness: 'Dry',
      windDirectionRad: 0,
      windDirectionDeg: 0,
      windRelativeDirectionRad: Math.PI,
      windRelativeDirectionDeg: 180,
      windVelocityMs: 5.0,
      yawNorthDirectionRad: Math.PI,
      yawNorthDirectionDeg: 180,
      sessionSecondsAfterMidnight: 43200,
    });
  });

  it.each([
    [0, 'Unknown'],
    [1, 'Dry'],
    [2, 'Mostly Dry'],
    [3, 'Very Lightly Wet'],
    [4, 'Lightly Wet'],
    [5, 'Moderately Wet'],
    [6, 'Very Wet'],
    [7, 'Extremely Wet'],
  ])('maps track wetness %i to "%s"', async (raw, expected) => {
    mockIr.get.mockImplementation(() => [raw]);

    const { trackWetness } = await computeWeather();

    expect(trackWetness).toBe(expected);
  });

  it('falls back to Unknown for out-of-range wetness value', async () => {
    mockIr.get.mockImplementation(() => 99);

    const { trackWetness } = await computeWeather();

    expect(trackWetness).toBe('Unknown');
  });
});
