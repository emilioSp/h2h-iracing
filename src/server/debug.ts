export const debug = (...params: any[]) => {
  if (process.env.LOG_LEVEL === 'debug') {
    console.log(...params);
  }
};
