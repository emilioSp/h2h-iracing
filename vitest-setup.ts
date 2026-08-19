import { afterEach } from 'vitest';
import { resetIRSDK } from '#repository/irsdk.repository.ts';

afterEach(() => {
  resetIRSDK();
});
