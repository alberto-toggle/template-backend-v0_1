import { Ajv, type JSONSchemaType } from 'ajv';

export interface EnvConfig {
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  AUTH_EXTERNAL_MODE: string;
  JWT_ISSUER?: string;
  JWT_AUDIENCE?: string;
  JWT_ALGORITHM: string;
  JWT_CLOCK_SKEW_SECONDS: number;
  JWT_PRIVATE_KEY?: string;
  JWT_PUBLIC_KEY?: string;
}

const schema: JSONSchemaType<EnvConfig> = {
  type: 'object',
  properties: {
    SERVICE_NAME: { type: 'string', minLength: 1 },
    PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    LOG_LEVEL: { type: 'string', minLength: 1 },
    DATABASE_URL: { type: 'string', minLength: 1 },
    JWT_SECRET: { type: 'string' },
    JWT_EXPIRES_IN: { type: 'integer', minimum: 60 },
    AUTH_EXTERNAL_MODE: { type: 'string', minLength: 1 },
    JWT_ISSUER: { type: 'string', nullable: true },
    JWT_AUDIENCE: { type: 'string', nullable: true },
    JWT_ALGORITHM: { type: 'string', minLength: 1 },
    JWT_CLOCK_SKEW_SECONDS: { type: 'integer', minimum: 0 },
    JWT_PRIVATE_KEY: { type: 'string', nullable: true },
    JWT_PUBLIC_KEY: { type: 'string', nullable: true }
  },
  required: [
    'SERVICE_NAME',
    'PORT',
    'LOG_LEVEL',
    'DATABASE_URL',
    'JWT_EXPIRES_IN',
    'AUTH_EXTERNAL_MODE',
    'JWT_ALGORITHM',
    'JWT_CLOCK_SKEW_SECONDS'
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
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN ?? 3600),
  AUTH_EXTERNAL_MODE: process.env.AUTH_EXTERNAL_MODE ?? 'mock_allow',
  JWT_ISSUER: process.env.JWT_ISSUER ?? '',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? '',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM ?? 'HS256',
  JWT_CLOCK_SKEW_SECONDS: Number(process.env.JWT_CLOCK_SKEW_SECONDS ?? 0),
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ?? '',
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY ?? ''
};

if (!validate(envData)) {
  const errors = validate.errors?.map((e) => `${e.instancePath} ${e.message}`).join(', ');
  throw new Error(`Invalid environment configuration: ${errors}`);
}

export const env = envData;
