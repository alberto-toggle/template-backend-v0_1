import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '@src/constants/error-codes.js';
import { buildError } from '@src/utils/response-builder.js';

export async function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      if (error.validation) {
        const statusCode = StatusCodes.BAD_REQUEST;
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

      const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
      const errorCode =
        statusCode === StatusCodes.UNAUTHORIZED
          ? ErrorCodes.UNAUTHORIZED
          : statusCode === StatusCodes.FORBIDDEN
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
