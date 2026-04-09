import {
  getAirTemperature,
  getPrecipitation,
  getRelativeHumidity,
  getSessionSecondsAfterMidnight,
  getTrackTemperature,
  getTrackWetness,
  getWindDirection,
  getWindVelocity,
  getYawNorthDirection,
} from '#repository/irsdk.repository.ts';
import type { Weather } from '#schema/weather.schema.ts';

const radToDeg = (rad: number) => rad * (180 / Math.PI);

export const computeWeather = async (): Promise<Weather> => {
  const windDirectionRad = await getWindDirection();
  const yawNorthDirectionRad = await getYawNorthDirection();

  // range [-PI, +PI]
  let windRelativeDirectionRad = Math.atan2(
    Math.sin(windDirectionRad - yawNorthDirectionRad),
    Math.cos(windDirectionRad - yawNorthDirectionRad),
  );

  // range [0, 2PI]
  if (windRelativeDirectionRad < 0) windRelativeDirectionRad += Math.PI * 2;

  const relativeHumidityPct = parseFloat(
    ((await getRelativeHumidity()) * 100).toFixed(2),
  );

  return {
    airTemperatureC: await getAirTemperature(),
    trackTemperatureC: await getTrackTemperature(),
    relativeHumidityPct,
    precipitationPct: await getPrecipitation(),
    trackWetness: await getTrackWetness(),
    windDirectionRad,
    windDirectionDeg: radToDeg(windDirectionRad),
    windRelativeDirectionRad,
    windRelativeDirectionDeg: radToDeg(windRelativeDirectionRad),
    windVelocityMs: await getWindVelocity(),
    yawNorthDirectionRad,
    yawNorthDirectionDeg: radToDeg(yawNorthDirectionRad),
    sessionSecondsAfterMidnight: await getSessionSecondsAfterMidnight(),
  };
};
