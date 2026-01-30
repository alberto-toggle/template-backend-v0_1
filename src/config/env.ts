import { Ajv, type JSONSchemaType } from 'ajv';

export interface EnvConfig {
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  DATABASE_URL: string;
}

const schema: JSONSchemaType<EnvConfig> = {
  type: 'object',
  properties: {
    SERVICE_NAME: { type: 'string', minLength: 1 },
    PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    LOG_LEVEL: { type: 'string', minLength: 1 },
    DATABASE_URL: { type: 'string', minLength: 1 }
  },
  required: ['SERVICE_NAME', 'PORT', 'LOG_LEVEL', 'DATABASE_URL'],
  additionalProperties: true
};

const ajv = new Ajv({ allErrors: true, coerceTypes: true });
const validate = ajv.compile(schema);

const envData = {
  SERVICE_NAME: process.env.SERVICE_NAME ?? 'microservice-name',
  PORT: Number(process.env.PORT ?? 3000),
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  DATABASE_URL: process.env.DATABASE_URL ?? ''
};

if (!validate(envData)) {
  const errors = validate.errors?.map((e) => `${e.instancePath} ${e.message}`).join(', ');
  throw new Error(`Invalid environment configuration: ${errors}`);
}

export const env = envData;
