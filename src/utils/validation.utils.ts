import { Ajv } from 'ajv';

const ajv = new Ajv({ allErrors: true, coerceTypes: true });

export function validateWithAjv<T>(schema: object, data: unknown) {
  const validate = ajv.compile<T>(schema);
  const valid = validate(data);
  return {
    valid: Boolean(valid),
    errors: validate.errors?.map((e) => `${e.instancePath} ${e.message}`) ?? []
  };
}
