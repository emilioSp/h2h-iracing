// Stores session info repository state when telemetry is refreshed or queried.
import type { Session } from '@emiliosp/node-iracing-sdk';

import irsdkRepository from '#repository/irsdk.repository.ts';

type SessionInfo = {
  sessionType: string;
  resultsPosition: Map<number, Exclude<Session['ResultsPositions'], null>[number]>;
};

export class SessionInfoRepository {
  private sessionInfo: SessionInfo = {
    sessionType: '',
    resultsPosition: new Map(),
  };

  refreshCurrentSessionInfo = async (): Promise<SessionInfo> => {
    const currentSessionInfo = await irsdkRepository.getCurrentSessionInfo();

    if (!currentSessionInfo) {
      return this.sessionInfo;
    }

    if (!Array.isArray(currentSessionInfo.ResultsPositions)) {
      return this.sessionInfo;
    }

    this.sessionInfo.sessionType = currentSessionInfo?.SessionType ?? '';

    for (const resultPosition of currentSessionInfo.ResultsPositions) {
      this.sessionInfo.resultsPosition.set(resultPosition.CarIdx, resultPosition);
    }

    return this.sessionInfo;
  };

  getSessionLapsCompleted = (carIdx: number) =>
    this.sessionInfo.resultsPosition.get(carIdx)?.LapsComplete ?? -1;

  getSessionLastLapTime = (carIdx: number) =>
    this.sessionInfo.resultsPosition.get(carIdx)?.LastTime ?? -1;

  getSessionBestTime = (carIdx: number) =>
    this.sessionInfo.resultsPosition.get(carIdx)?.FastestTime ?? -1;

  getSessionType = () => this.sessionInfo.sessionType;

  isRaceSession = (): boolean => {
    const sessionType = this.getSessionType();

    return sessionType.toLowerCase() === 'race';
  };
}

export default new SessionInfoRepository();
