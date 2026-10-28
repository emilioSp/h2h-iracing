// Resets the test SDK after each test so scenarios never reuse a previous connection.
import { afterEach } from 'vitest';

import irsdkRepository from '#repository/irsdk.repository.ts';

afterEach(() => {
  irsdkRepository.resetIRSDK();
});
