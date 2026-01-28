import type { FastifyInstance } from 'fastify';

import { getHealthHandler } from '@src/controllers/health/health.controller.js';

export async function registerHealthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', getHealthHandler);
}
