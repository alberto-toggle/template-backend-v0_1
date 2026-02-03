import { env } from '@src/config/env.js';

export const logger = {
  level: env.LOG_LEVEL,
  ...(process.env.NODE_ENV !== 'production'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard'
          }
        }
      }
    : {})
};
