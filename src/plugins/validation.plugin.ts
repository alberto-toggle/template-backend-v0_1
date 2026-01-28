import type { FastifyInstance } from 'fastify';

import { createUserBodySchema, userIdParamsSchema } from '../schemas/user.schema.js';

export async function registerValidationPlugin(fastify: FastifyInstance) {
  fastify.addSchema(createUserBodySchema);
  fastify.addSchema(userIdParamsSchema);
}
