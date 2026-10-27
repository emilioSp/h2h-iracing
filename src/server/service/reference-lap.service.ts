// Records reference laps when race telemetry advances, keeping track-specific sampling state.
import driverRepository from '#repository/driver.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import type { ReferenceLap } from '#repository/reference-lap.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import { normalizeTrackPct } from '#server/utils/normalize-track-pct.ts';

const REF_POINTS_DISTANCE_METERS = 10;

const COVERAGE_THRESHOLD = 0.6;

type CollectLapDataInput = {
  carIdx: number;
  trackPct: number;
  sessionTime: number;
  isOnPitRoad: boolean;
};

export class ReferenceLapService {
  getMinPointsForValidLap = (): number =>
    Math.floor((1 / this.getReferenceInterval()) * COVERAGE_THRESHOLD);

  private referenceInterval = 0;

  getReferenceInterval = (): number => this.referenceInterval;

  initReferenceInterval = (trackLengthMeters: number): void => {
    this.referenceInterval =
      trackLengthMeters > 0 ? REF_POINTS_DISTANCE_METERS / trackLengthMeters : 0;
  };

  private isLapValid = (lap: ReferenceLap) => {
    const lapTime = lap.finishTime - lap.startTime;

    return lap.refPoints.size >= this.getMinPointsForValidLap() && lapTime > 0 && !lap.isOnPitRoad;
  };

  private collectLapData = ({
    carIdx,
    trackPct,
    sessionTime,
    isOnPitRoad,
  }: CollectLapDataInput): void => {
    const refPointKey = normalizeTrackPct({ trackPct, referenceInterval: this.referenceInterval });
    const activeRefLap = referenceLapRepository.getActiveRefLap(carIdx);

    if (activeRefLap) {
      const isLapCompleted = activeRefLap.lastTrackedPct > 0.95 && trackPct < 0.05;

      if (!isLapCompleted) {
        activeRefLap.isOnPitRoad = isOnPitRoad;
        activeRefLap.refPoints.set(refPointKey, {
          timeElapsedSinceStart: sessionTime - activeRefLap.startTime,
          trackPct,
        });
        activeRefLap.lastTrackedPct = trackPct;

        return;
      }

      activeRefLap.finishTime = sessionTime;

      if (this.isLapValid(activeRefLap)) {
        referenceLapRepository.addRecentLap({ carIdx, lap: activeRefLap });
      }
    }

    referenceLapRepository.setActiveRefLap({
      carIdx,
      lap: {
        startTime: sessionTime,
        finishTime: -1,
        refPoints: new Map([[refPointKey, { trackPct, timeElapsedSinceStart: 0 }]]),
        lastTrackedPct: trackPct,
        isOnPitRoad,
      },
    });
  };

  updateReferenceLaps = async (): Promise<void> => {
    const lapDistPct = await irsdkRepository.getLapDistPct();
    const sessionTime = await irsdkRepository.getSessionTime();
    const onPitRoad = await irsdkRepository.getOnPitRoad();
    const carIdxs = await driverRepository.getCarsIdx();

    for (const carIdx of carIdxs) {
      if ((lapDistPct[carIdx] ?? -1) < 0) continue;
      this.collectLapData({
        carIdx,
        trackPct: lapDistPct[carIdx],
        sessionTime,
        isOnPitRoad: onPitRoad[carIdx],
      });
    }
  };
}

export default new ReferenceLapService();
