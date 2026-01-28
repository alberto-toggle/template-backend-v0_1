import type { FastifyInstance } from 'fastify';

import { createUserBodySchema, userIdParamsSchema } from '@src/schemas/user.schema.js';

export async function registerValidationPlugin(fastify: FastifyInstance) {
  fastify.addSchema(createUserBodySchema);
  fastify.addSchema(userIdParamsSchema);
}
