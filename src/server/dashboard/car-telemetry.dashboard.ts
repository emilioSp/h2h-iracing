// Assembles car control settings when the car telemetry overlay polls.
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { CarTelemetry } from '#schema/car-telemetry.schema.ts';

export const computeCarTelemetry = async (): Promise<CarTelemetry> => ({
  abs: await irsdkRepository.getAbsAdjust(),
  tc: await irsdkRepository.getTcAdjust(),
  isAbsActive: await irsdkRepository.getIsAbsActive(),
  brakeBias: await irsdkRepository.getBrakeBias(),
  isPitSpeedLimiterActive: await irsdkRepository.getIsPitSpeedLimiterActive(),
});
