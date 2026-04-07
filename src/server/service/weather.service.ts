import {
  getAirTemperature,
  getPrecipitation,
  getRelativeHumidity,
  getTrackTemperature,
  getTrackWetness,
  getWindDirection,
  getWindVelocity,
} from '#repository/irsdk.repository.ts';
import type { Weather } from '#schema/weather.schema.ts';

export const computeWeather = async (): Promise<Weather> => ({
  airTemperatureC: await getAirTemperature(),
  trackTemperatureC: await getTrackTemperature(),
  relativeHumidityPct: await getRelativeHumidity(),
  precipitationPct: await getPrecipitation(),
  trackWetness: await getTrackWetness(),
  windDirectionRad: await getWindDirection(),
  windVelocityMs: await getWindVelocity(),
});
