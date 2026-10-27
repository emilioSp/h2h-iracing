// Refreshes telemetry and updates derived session state and tracking during each polling cycle.
import driverRepository from '#repository/driver.repository.ts';
import fuelRepository from '#repository/fuel.repository.ts';
import irsdkRepository from '#repository/irsdk.repository.ts';
import lapRepository from '#repository/lap.repository.ts';
import referenceLapRepository from '#repository/reference-lap.repository.ts';
import sessionInfoRepository from '#repository/session-info.repository.ts';
import referenceLapService from '#service/reference-lap.service.ts';

export class TelemetryTick {
  private previousSessionNum = -1;

  private initTrackLengthMeters = async (): Promise<void> => {
    const trackLength = await irsdkRepository.getTrackLengthMeters();
    referenceLapService.initReferenceInterval(trackLength);
  };

  resetInMemoryStorage = () => {
    referenceLapRepository.resetReferenceLaps();
    fuelRepository.resetFuelTracking();
    lapRepository.resetLapTimeTracking();
  };

  onSessionChange = async () => {
    const currentSessionNum = await irsdkRepository.getSessionNum();

    if (currentSessionNum === this.previousSessionNum) {
      return;
    }

    await this.initTrackLengthMeters();
    this.resetInMemoryStorage();

    this.previousSessionNum = currentSessionNum;
  };

  tick = async (): Promise<void> => {
    await irsdkRepository.refreshTelemetry();
    await driverRepository.refreshDriverInfo();
    await sessionInfoRepository.refreshCurrentSessionInfo();

    await this.onSessionChange();

    if (sessionInfoRepository.isRaceSession()) await referenceLapService.updateReferenceLaps();
  };
}

export default new TelemetryTick();
