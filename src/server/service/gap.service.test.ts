// Verifies race gap calculations during regression tests.
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { gapUnit } from '#common/constants/gap-unit.ts';
import { gapCars } from '#fixtures/gap-cars.ts';
import { gapReferenceLap } from '#fixtures/gap-reference-lap.ts';
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import * as gapDelta from '#server/utils/estimated-delta.ts';
import * as referenceGapDelta from '#server/utils/reference-delta.ts';
import { getGap } from '#service/gap.service.ts';
import referenceLapService from '#service/reference-lap.service.ts';

beforeEach(() => {
  vi.restoreAllMocks();
  referenceLapService.initReferenceInterval(5_000);
  referenceLapRepository.resetReferenceLaps();
});

describe('getGap', () => {
  it('given the same car is passed as player and ahead when gaps are computed then the ahead gap is zero and the behind gap is empty', async () => {
    const result = await getGap({
      ahead: gapCars[0],
      player: gapCars[0],
      behind: null,
    });

    expect(result).toEqual({
      gapAhead: { value: 0, unit: gapUnit.SECONDS },
      gapBehind: null,
    });
  });

  it('given iRacing reports a car on pit road when gaps are computed then only the estimated delta is used', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/pit-road.json');
    await driverRepository.refreshDriverInfo();
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(referenceGapDelta, 'referenceDelta');

    await getGap({
      ahead: gapCars[1],
      player: gapCars[0],
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
  });

  it('given iRacing reports all cars on track with reference laps when gaps are computed then only reference deltas are used', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/reference.json');
    await driverRepository.refreshDriverInfo();

    for (const carIdx of [0, 1, 2]) {
      referenceLapRepository.addRecentLap({ carIdx, lap: structuredClone(gapReferenceLap) });
    }

    const referenceDelta = vi.spyOn(referenceGapDelta, 'referenceDelta');
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');

    await getGap({
      ahead: gapCars[1],
      player: gapCars[0],
      behind: gapCars[2],
    });

    expect(referenceDelta).toHaveBeenCalled();
    expect(estimatedDelta).not.toHaveBeenCalled();
  });

  it('given iRacing reports the ahead car across the finish line when gaps are computed then the gap is corrected', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/crossed-finish.json');
    await driverRepository.refreshDriverInfo();
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: structuredClone(gapReferenceLap) });

    const result = await getGap({
      ahead: gapCars[1],
      player: gapCars[0],
      behind: null,
    });

    expect(result.gapAhead).toEqual({
      value: expect.closeTo(54),
      unit: gapUnit.SECONDS,
    });
  });

  it('given iRacing reports fewer than two completed laps when gaps are computed then only the estimated delta is used', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/few-laps.json');
    await driverRepository.refreshDriverInfo();
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: structuredClone(gapReferenceLap) });
    const estimatedDelta = vi.spyOn(gapDelta, 'estimatedDelta');
    const referenceDelta = vi.spyOn(referenceGapDelta, 'referenceDelta');

    await getGap({
      ahead: gapCars[1],
      player: gapCars[0],
      behind: null,
    });

    expect(estimatedDelta).toHaveBeenCalled();
    expect(referenceDelta).not.toHaveBeenCalled();
  });

  it('given iRacing reports an estimated gap across the finish line when gaps are computed then the gap wraps', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/estimated-wrap.json');
    await driverRepository.refreshDriverInfo();

    const result = await getGap({
      ahead: gapCars[0],
      player: gapCars[1],
      behind: null,
    });

    expect(result.gapAhead).toEqual({
      value: expect.closeTo(3.6),
      unit: gapUnit.SECONDS,
    });
  });

  it('given iRacing reports a reference gap across the finish line when gaps are computed then the gap wraps', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/reference-wrap.json');
    await driverRepository.refreshDriverInfo();
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: structuredClone(gapReferenceLap) });
    referenceLapRepository.addRecentLap({ carIdx: 1, lap: structuredClone(gapReferenceLap) });

    const result = await getGap({
      ahead: null,
      player: gapCars[0],
      behind: gapCars[1],
    });

    expect(result.gapBehind).toEqual({
      value: expect.closeTo(3.6),
      unit: gapUnit.SECONDS,
    });
  });

  it('given iRacing reports cars multiple laps apart when gaps are computed then both gaps use laps', async () => {
    irsdkRepository.loadTelemetryFixture('tests/fixtures/telemetry-mock/gap/multiple-laps.json');
    await driverRepository.refreshDriverInfo();

    const result = await getGap({
      ahead: gapCars[1],
      player: gapCars[0],
      behind: gapCars[2],
    });

    expect(result).toEqual({
      gapAhead: { value: 2, unit: gapUnit.LAPS },
      gapBehind: { value: 2, unit: gapUnit.LAPS },
    });
  });
});
