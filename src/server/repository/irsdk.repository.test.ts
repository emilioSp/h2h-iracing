// Verifies the common connection policy with fixture-backed test SDK instances.
import { describe, expect, it } from 'vitest';

import { isIRacingConnected, loadTelemetryFixture } from '#repository/irsdk.repository.ts';

const connectionCases = [
  { label: 'player zero', fixture: 'connected.json', expected: true },
  { label: 'negative player', fixture: 'negative-player.json', expected: false },
  { label: 'missing player index', fixture: 'missing-player-index.json', expected: false },
];

describe('test SDK connection policy', () => {
  it.each(connectionCases)(
    'given a connected test SDK with $label when connection status is queried initially and again then it resolves to $expected',
    async ({ fixture, expected }) => {
      loadTelemetryFixture(`fixture/telemetry-mock/connection/${fixture}`);

      expect(await isIRacingConnected()).toBe(expected);
      expect(await isIRacingConnected()).toBe(expected);
    },
  );
});
