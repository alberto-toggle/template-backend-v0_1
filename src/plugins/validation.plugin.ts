import type { FastifyInstance } from 'fastify';
import { authLoginBodySchema } from '@src/schemas/auth.schema.js';

export async function registerValidationPlugin(fastify: FastifyInstance) {
  fastify.addSchema(authLoginBodySchema);
}
