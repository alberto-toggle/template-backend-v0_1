import { randomUUID } from 'node:crypto';

import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { buildApiError, getStatusCode } from '@src/dto/api-error.dto.js';

export async function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) || randomUUID();

    const errorResponse = buildApiError({
      code: error.name || 'INTERNAL_ERROR',
      message: error.message,
      correlationId
    });

    request.log.error(
      {
        err: error,
        req: {
          id: request.id,
          method: request.method,
          url: request.url,
          headers: request.headers
        },
        correlationId,
        userId: (request as FastifyRequest & { user?: { sub?: string } }).user?.sub
      },
      'API Error occurred'
    );

    reply.status(getStatusCode(error)).send(errorResponse);
  });
}
