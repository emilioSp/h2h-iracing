export class TelemetryConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TelemetryConnectionError';
  }
}

export class TelemetryReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TelemetryReadError';
  }
}
