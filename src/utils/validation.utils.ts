import { Ajv } from 'ajv';

const ajv = new Ajv({ allErrors: true, coerceTypes: true });

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationErrorDetail[];
}

/**
 * Validates data against an AJV schema with enhanced logging and error formatting.
 */
export function validateWithAjv<T>(
  schema: object,
  data: unknown,
  context: {
    correlationId?: string;
    url?: string;
    method?: string;
    logger?: {
      warn: (obj: object, msg: string) => void;
      debug: (obj: object, msg: string) => void;
    };
  } = {}
): ValidationResult<T> {
  const startTime = Date.now();
  const correlationId = context.correlationId || 'unknown';
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const validationErrors: ValidationErrorDetail[] =
      validate.errors?.map((err) => ({
        field: err.instancePath.replace(/^\//, '') || 'root',
        message: err.message || 'Invalid value',
        code: err.keyword
      })) ?? [];

    if (context.logger) {
      context.logger.warn(
        {
          correlationId,
          url: context.url,
          method: context.method,
          errors: validationErrors,
          processingTime: `${Date.now() - startTime}ms`
        },
        'Validation failed'
      );
    }

    return {
      success: false,
      errors: validationErrors
    };
  }

  if (context.logger) {
    context.logger.debug(
      {
        correlationId: context.correlationId,
        processingTime: `${Date.now() - startTime}ms`
      },
      'Validation completed successfully'
    );
  }

  return {
    success: true,
    data: data as T
  };
}
