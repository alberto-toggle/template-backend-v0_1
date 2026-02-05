import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ErrorCodes } from '@src/constants/error-codes.js';
import { buildError } from '@src/utils/response-builder.js';

export async function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      if (error.validation) {
        const statusCode = 400;
        reply.status(statusCode).send(
          buildError({
            status: statusCode,
            message: 'validation error',
            errorCode: ErrorCodes.VALIDATION_ERROR,
            details: error.validation
          })
        );
        return;
      }

      const statusCode = error.statusCode ?? 500;
      const errorCode =
        statusCode === 401
          ? ErrorCodes.UNAUTHORIZED
          : statusCode === 403
            ? ErrorCodes.NO_PERMISSIONS
            : ErrorCodes.INTERNAL_ERROR;

      reply.status(statusCode).send(
        buildError({
          status: statusCode,
          message: error.message || 'internal error',
          errorCode
        })
      );
    }
  );
}
