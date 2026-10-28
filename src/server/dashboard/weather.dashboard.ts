// Assembles weather measurements and unit conversions when the weather overlay polls.
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { Weather } from '#schema/weather.schema.ts';

const radToDeg = (rad: number) => rad * (180 / Math.PI);

export const computeWeather = async (): Promise<Weather> => {
  const windDirectionRad = await irsdkRepository.getWindDirection();
  const yawNorthDirectionRad = await irsdkRepository.getYawNorthDirection();

  // range [-PI, +PI]
  let windRelativeDirectionRad = Math.atan2(
    Math.sin(windDirectionRad - yawNorthDirectionRad),
    Math.cos(windDirectionRad - yawNorthDirectionRad),
  );

  // range [0, 2PI]
  if (windRelativeDirectionRad < 0) windRelativeDirectionRad += Math.PI * 2;

  const relativeHumidityPct = parseFloat(
    ((await irsdkRepository.getRelativeHumidity()) * 100).toFixed(1),
  );

  const precipitationPct = parseFloat(
    ((await irsdkRepository.getPrecipitation()) * 100).toFixed(1),
  );

  return {
    airTemperatureC: await irsdkRepository.getAirTemperature(),
    trackTemperatureC: await irsdkRepository.getTrackTemperature(),
    relativeHumidityPct,
    precipitationPct,
    trackWetness: await irsdkRepository.getTrackWetness(),
    windDirectionRad,
    windDirectionDeg: radToDeg(windDirectionRad),
    windRelativeDirectionRad,
    windRelativeDirectionDeg: radToDeg(windRelativeDirectionRad),
    windVelocityMs: await irsdkRepository.getWindVelocity(),
    yawNorthDirectionRad,
    yawNorthDirectionDeg: radToDeg(yawNorthDirectionRad),
    sessionSecondsAfterMidnight: await irsdkRepository.getSessionSecondsAfterMidnight(),
  };
};
