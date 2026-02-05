import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '@src/config/env.js';

export async function registerAuthPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('auth', null);

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const header = request.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        reply.code(401).send({ error_code: 'UNAUTHORIZED', message: 'missing bearer token' });
        return;
      }

      const token = header.slice('Bearer '.length).trim();
      if (!token) {
        reply.code(401).send({ error_code: 'UNAUTHORIZED', message: 'missing bearer token' });
        return;
      }

      try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        request.auth = payload as Record<string, unknown>;
      } catch {
        reply.code(401).send({ error_code: 'INVALID_TOKEN', message: 'invalid or expired token' });
        return;
      }
    }
  );
}
