import pino from 'pino';
import { env } from '@src/config/env.js';

const logLevel = env.LOG_LEVEL;
const nodeEnv = process.env.NODE_ENV || 'development';

/** Pino options used by Fastify and createLogger */
const loggerOptions: pino.LoggerOptions = {
  name: env.SERVICE_NAME,
  level: logLevel,
  ...(nodeEnv === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: true
      }
    }
  }),
  ...(nodeEnv === 'production' && {
    formatters: {
      level: (label) => ({
        level: label.toUpperCase()
      })
    },
    timestamp: pino.stdTimeFunctions.isoTime
  }),
  base: {
    service: env.SERVICE_NAME,
    version: env.SERVICE_VERSION,
    environment: nodeEnv
  }
};

/** Logger config object for Fastify (expects options, not a pino instance) */
export const fastifyLoggerOptions = loggerOptions;

export const createLogger = (name?: string) => {
  return pino({
    ...loggerOptions,
    name: name || env.SERVICE_NAME
  });
};

export const logger = createLogger();
