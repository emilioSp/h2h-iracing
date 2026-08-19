import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  type DriverInfo,
  SESSION_DATA_KEYS,
  type SessionInfo,
  VARS,
  type WeekendInfo,
} from '@emiliosp/node-iracing-sdk';
import { z } from 'zod/v4';

type VarKey = (typeof VARS)[keyof typeof VARS];
type SessionDataKey =
  (typeof SESSION_DATA_KEYS)[keyof typeof SESSION_DATA_KEYS];
type SessionDataValue = {
  DriverInfo: DriverInfo;
  SessionInfo: SessionInfo;
  WeekendInfo: WeekendInfo;
};

type FixtureState = {
  variables: Record<string, unknown[]>;
  sessionData: Record<string, unknown>;
};

const stateSchema = z
  .object({
    variables: z.record(z.string(), z.array(z.unknown())).optional(),
    sessionData: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

const fixtureSchema = z
  .object({
    connected: z.boolean().optional(),
    variables: z.record(z.string(), z.array(z.unknown())).optional(),
    sessionData: z.record(z.string(), z.unknown()).optional(),
    frames: z.array(stateSchema).min(1).optional(),
  })
  .strict()
  .superRefine((fixture, context) => {
    const validVariables = new Set<string>(Object.values(VARS));
    const validSessionData = new Set<string>(Object.values(SESSION_DATA_KEYS));
    const states = [fixture, ...(fixture.frames ?? [])];

    for (const state of states) {
      for (const key of Object.keys(state.variables ?? {})) {
        if (!validVariables.has(key)) {
          context.addIssue({
            code: 'custom',
            message: `Unknown telemetry variable: ${key}`,
          });
        }
      }
      for (const key of Object.keys(state.sessionData ?? {})) {
        if (!validSessionData.has(key)) {
          context.addIssue({
            code: 'custom',
            message: `Unknown session data key: ${key}`,
          });
        }
      }
    }
  });

const toState = (input: {
  variables?: Record<string, unknown[]>;
  sessionData?: Record<string, unknown>;
}): FixtureState => ({
  variables: input.variables ?? {},
  sessionData: input.sessionData ?? {},
});

export class IRSDKMock {
  private connected: boolean;
  private readonly base: FixtureState;
  private readonly frames: FixtureState[];
  private frameIndex = -1;

  private constructor(input: {
    connected: boolean;
    base: FixtureState;
    frames: FixtureState[];
  }) {
    this.connected = input.connected;
    this.base = input.base;
    this.frames = input.frames;
  }

  static fromFixture(filePath: string): IRSDKMock {
    const content = readFileSync(resolve(filePath), 'utf8');
    const fixture = fixtureSchema.parse(JSON.parse(content));

    return new IRSDKMock({
      connected: fixture.connected ?? true,
      base: toState(fixture),
      frames: (fixture.frames ?? []).map(toState),
    });
  }

  private getActiveFrame(): FixtureState | undefined {
    if (this.frameIndex < 0) return undefined;
    return this.frames[this.frameIndex];
  }

  isConnected(): boolean {
    return this.connected;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Match the IRSDK public contract.
  get(key: VarKey): Array<any> {
    return (
      this.getActiveFrame()?.variables[key] ?? this.base.variables[key] ?? []
    );
  }

  getSessionInfo<K extends SessionDataKey>(
    key: K,
  ): K extends keyof SessionDataValue ? SessionDataValue[K] : unknown {
    const value =
      this.getActiveFrame()?.sessionData[key] ?? this.base.sessionData[key];
    return value as K extends keyof SessionDataValue
      ? SessionDataValue[K]
      : unknown;
  }

  refreshSharedMemory(): void {
    if (this.frameIndex < this.frames.length - 1) {
      this.frameIndex += 1;
    }
  }

  shutdown(): void {
    this.connected = false;
  }
}
