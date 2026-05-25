export const Logger = {
  info:  (msg: string): void => console.info(`[INFO]  ${msg}`),
  debug: (msg: string): void => console.debug(`[DEBUG] ${msg}`),
  warn:  (msg: string): void => console.warn(`[WARN]  ${msg}`),
  error: (msg: string): void => console.error(`[ERROR] ${msg}`),
};
