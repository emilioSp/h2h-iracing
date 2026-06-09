import {
  getAbsAdjust,
  getBrakeBias,
  getIsAbsActive,
  getIsPitSpeedLimiterActive,
  getTcAdjust,
} from '#repository/irsdk.repository.ts';
import type { CarTelemetry } from '#schema/car-telemetry.schema.ts';

export const computeCarTelemetry = async (): Promise<CarTelemetry> => ({
  abs: await getAbsAdjust(),
  tc: await getTcAdjust(),
  isAbsActive: await getIsAbsActive(),
  brakeBias: await getBrakeBias(),
  isPitSpeedLimiterActive: await getIsPitSpeedLimiterActive(),
});
