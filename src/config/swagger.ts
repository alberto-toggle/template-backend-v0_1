import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { env } from './env.js';

export async function registerSwagger(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: env.SERVICE_NAME,
        version: process.env.npm_package_version ?? '0.1.0'
      }
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs'
  });
}
