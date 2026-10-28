// Supplies a complete weather payload when broadcaster tests verify SSE delivery.
import { trackWetness } from '#common/constants/track-wetness.ts';
import type { Weather } from '#schema/weather.schema.ts';

export const broadcastWeather: Weather = {
  airTemperatureC: 20,
  trackTemperatureC: 30,
  relativeHumidityPct: 50,
  precipitationPct: 0,
  trackWetness: trackWetness.DRY,
  windDirectionRad: 0,
  windDirectionDeg: 0,
  windRelativeDirectionRad: 0,
  windRelativeDirectionDeg: 0,
  windVelocityMs: 0,
  yawNorthDirectionRad: 0,
  yawNorthDirectionDeg: 0,
  sessionSecondsAfterMidnight: 0,
};
