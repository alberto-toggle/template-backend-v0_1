import type { FastifyInstance } from 'fastify';

export async function registerAuthPlugin(fastify: FastifyInstance) {
  // Placeholder for authentication/authorization hooks
  fastify.decorateRequest('user', null);
}
