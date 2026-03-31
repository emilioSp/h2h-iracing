export const debug = (...params: unknown[]) => {
  if (process.env.LOG_LEVEL === 'debug') {
    console.log(...params);
  }
};
