import { env } from './env.js';

const createLogger = () => ({
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`),
  warn: (message) => console.warn(`[WARN] ${message}`),
});

export const logger = createLogger();
