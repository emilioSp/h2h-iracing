import type { Session } from '@emiliosp/node-iracing-sdk';
import { getCurrentSessionInfo } from '#repository/irsdk.repository.ts';

type SessionInfo = {
  sessionType: string;
  resultsPosition: Map<number, Session['ResultsPositions'][number]>;
};

const sessionInfo: SessionInfo = {
  sessionType: '',
  resultsPosition: new Map(),
};

export const refreshCurrentSessionInfo = async (): Promise<SessionInfo> => {
  const currentSessionInfo = await getCurrentSessionInfo();
  if (!currentSessionInfo) {
    return sessionInfo;
  }

  sessionInfo.sessionType = currentSessionInfo?.SessionType ?? '';
  for (const resultPosition of currentSessionInfo.ResultsPositions) {
    sessionInfo.resultsPosition.set(resultPosition.CarIdx, resultPosition);
  }

  return sessionInfo;
};

export const getSessionInfo = () => sessionInfo;

export const getSessionLapsCompleted = (carIdx: number) =>
  sessionInfo.resultsPosition.get(carIdx)?.LapsComplete ?? -1;

export const getSessionLastLapTime = (carIdx: number) =>
  sessionInfo.resultsPosition.get(carIdx)?.LastTime ?? -1;

export const getSessionBestTime = (carIdx: number) =>
  sessionInfo.resultsPosition.get(carIdx)?.FastestTime ?? -1;

export const getSessionType = () => sessionInfo.sessionType;
