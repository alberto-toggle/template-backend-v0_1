import type { FastifyInstance } from 'fastify';

import { getHealthHandler } from './health.controller.js';

export async function registerHealthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', getHealthHandler);
}
