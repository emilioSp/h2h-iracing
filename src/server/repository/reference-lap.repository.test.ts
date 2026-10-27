// Verifies reference lap selection during regression tests.
import { beforeEach, describe, expect, it } from 'vitest';

import { referenceLapWindow } from '#fixtures/reference-lap-window.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';

const [lap1, lap2, lap3, lap4, lap5, lap6] = referenceLapWindow;

beforeEach(() => {
  referenceLapRepository.resetReferenceLaps();
});

describe('getRefLap', () => {
  it('given no recent laps exist for a car when the reference lap is requested then its reference lap is null', () => {
    expect(referenceLapRepository.getRefLap(0)).toBeNull();
  });

  it('given the recent window is not full when the reference lap is requested then its fastest lap is returned', () => {
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap1 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap2 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap3 });

    expect(referenceLapRepository.getRefLap(0)).toBe(lap1);
  });

  it('given the recent window overflows when the reference lap is requested then the expired fastest lap is excluded', () => {
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap1 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap2 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap3 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap4 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap5 });
    referenceLapRepository.addRecentLap({ carIdx: 0, lap: lap6 });

    expect(referenceLapRepository.getRefLap(0)).toBe(lap5);
  });
});
