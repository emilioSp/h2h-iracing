import { IRSDK } from '@emiliosp/node-iracing-sdk';
import config from '#config';

const connectToIRacing = async (): Promise<IRSDK> => {
  const ir =
    config.DATA_MODE === 'mock'
      ? IRSDK.fromDump(config.DUMP_FILE_PATH)
      : await IRSDK.connect();

  return ir;
};

export const ir = await connectToIRacing();
