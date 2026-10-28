// Rejects test-only operations when the backend is not running under tests.
export function assertTestEnvironment(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Telemetry fixtures are available only in tests');
  }
}
