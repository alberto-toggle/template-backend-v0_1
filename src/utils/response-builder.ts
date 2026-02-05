import type { ErrorCode } from '@src/constants/error-codes.js';

export type SuccessResponse<T> = {
  success: true;
  http_status: number;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
  pagination?: Record<string, unknown>;
};

export type ErrorResponse = {
  success: false;
  http_status: number;
  message: string;
  error_code: ErrorCode;
  details?: unknown;
  meta?: Record<string, unknown>;
};

export function buildSuccess<T>(params: {
  status: number;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
  pagination?: Record<string, unknown>;
}): SuccessResponse<T> {
  const { status, data, message, meta, pagination } = params;
  return {
    success: true,
    http_status: status,
    message,
    data,
    meta,
    pagination
  };
}

export function buildError(params: {
  status: number;
  message: string;
  errorCode: ErrorCode;
  details?: unknown;
  meta?: Record<string, unknown>;
}): ErrorResponse {
  const { status, message, errorCode, details, meta } = params;
  return {
    success: false,
    http_status: status,
    message,
    error_code: errorCode,
    details,
    meta
  };
}
