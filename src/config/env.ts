import { Ajv, type JSONSchemaType } from 'ajv';

export interface EnvConfig {
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  AUTH_EXTERNAL_MODE: string;
}

const schema: JSONSchemaType<EnvConfig> = {
  type: 'object',
  properties: {
    SERVICE_NAME: { type: 'string', minLength: 1 },
    PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    LOG_LEVEL: { type: 'string', minLength: 1 },
    DATABASE_URL: { type: 'string', minLength: 1 },
    JWT_SECRET: { type: 'string', minLength: 8 },
    JWT_EXPIRES_IN: { type: 'integer', minimum: 60 },
    AUTH_EXTERNAL_MODE: { type: 'string', minLength: 1 }
  },
  required: [
    'SERVICE_NAME',
    'PORT',
    'LOG_LEVEL',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'AUTH_EXTERNAL_MODE'
  ],
  additionalProperties: true
};

const ajv = new Ajv({ allErrors: true, coerceTypes: true });
const validate = ajv.compile(schema);

const envData = {
  SERVICE_NAME: process.env.SERVICE_NAME ?? 'microservice-name',
  PORT: Number(process.env.PORT ?? 3000),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me-super-secret',
  JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN ?? 3600),
  AUTH_EXTERNAL_MODE: process.env.AUTH_EXTERNAL_MODE ?? 'mock_allow'
};

if (!validate(envData)) {
  const errors = validate.errors?.map((e) => `${e.instancePath} ${e.message}`).join(', ');
  throw new Error(`Invalid environment configuration: ${errors}`);
}

export const env = envData;
