import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { ErrorCodes } from '@src/constants/error-codes.js';
import { buildError } from '@src/utils/response-builder.js';
import { assertJwtConfig, getJwtVerifyKey, getJwtVerifyOptions } from '@src/services/auth/jwt.utils.js';

export async function registerAuthPlugin(fastify: FastifyInstance) {
  assertJwtConfig();
  fastify.decorateRequest('auth', null);

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const header = request.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        const status = 401;
        reply.status(status).send(
          buildError({
            status,
            message: 'missing bearer token',
            errorCode: ErrorCodes.UNAUTHORIZED
          })
        );
        return;
      }

      const token = header.slice('Bearer '.length).trim();
      if (!token) {
        const status = 401;
        reply.status(status).send(
          buildError({
            status,
            message: 'missing bearer token',
            errorCode: ErrorCodes.UNAUTHORIZED
          })
        );
        return;
      }

      try {
        const payload = jwt.verify(token, getJwtVerifyKey(), getJwtVerifyOptions());
        request.auth = payload as unknown as Record<string, unknown>;
      } catch {
        const status = 401;
        reply.status(status).send(
          buildError({
            status,
            message: 'invalid or expired token',
            errorCode: ErrorCodes.INVALID_TOKEN
          })
        );
        return;
      }
    }
  );
}
