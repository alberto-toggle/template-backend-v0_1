/**
 * Standard error response format for API responses.
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    correlationId: string;
    timestamp: Date;
  };
}

export interface ApiErrorOptions {
  code: string;
  message: string;
  correlationId: string;
  details?: unknown;
}

export function buildApiError(options: ApiErrorOptions): ApiError {
  return {
    success: false,
    error: {
      code: options.code,
      message: options.message,
      ...(options.details !== undefined && { details: options.details }),
      correlationId: options.correlationId,
      timestamp: new Date()
    }
  };
}

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

export function getStatusCode(error: ErrorWithStatusCode): number {
  return error.statusCode ?? 500;
}
