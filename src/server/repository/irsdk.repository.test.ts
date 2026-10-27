// Verifies the common connection policy with fixture-backed test SDK instances.
import { describe, expect, it, vi } from 'vitest';

import irsdkRepository from '#repository/irsdk.repository.ts';

const connectionCases = [
  { label: 'player zero', fixture: 'connected.json', expected: true },
  { label: 'negative player', fixture: 'negative-player.json', expected: false },
  { label: 'missing player index', fixture: 'missing-player-index.json', expected: false },
];

describe('test SDK connection policy', () => {
  it('given a production environment when a telemetry fixture is loaded then it rejects the test-only operation', () => {
    vi.stubEnv('NODE_ENV', 'production');

    try {
      expect(() =>
        irsdkRepository.loadTelemetryFixture(
          'tests/fixtures/telemetry-mock/connection/connected.json',
        ),
      ).toThrow('Telemetry fixtures are available only in tests');
    } finally {
      vi.unstubAllEnvs();
    }
  });
  it('given no telemetry fixture when connection status is queried then it rejects without connecting to live iRacing', async () => {
    await expect(irsdkRepository.isIRacingConnected()).rejects.toThrow(
      'Load a telemetry fixture before reading telemetry',
    );
  });
  it.each(connectionCases)(
    'given a connected test SDK with $label when connection status is queried initially and again then it resolves to $expected',
    async ({ fixture, expected }) => {
      irsdkRepository.loadTelemetryFixture(`tests/fixtures/telemetry-mock/connection/${fixture}`);

      expect(await irsdkRepository.isIRacingConnected()).toBe(expected);
      expect(await irsdkRepository.isIRacingConnected()).toBe(expected);
    },
  );
});
