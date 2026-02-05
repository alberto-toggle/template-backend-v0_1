import type { FastifyInstance } from 'fastify';
import { loginHandler } from '@src/controllers/auth/auth.controller.js';

export async function registerAuthRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/api/v1/auth/login',
    {
      schema: {
        body: { $ref: 'AuthLoginBody' },
        response: {
          200: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              expires_in: { type: 'number' },
              modules: { type: 'array', items: { type: 'string' } }
            }
          },
          401: {
            type: 'object',
            properties: {
              error_code: { type: 'string' },
              message: { type: 'string' }
            }
          },
          403: {
            type: 'object',
            properties: {
              error_code: { type: 'string' },
              message: { type: 'string' }
            }
          },
          404: {
            type: 'object',
            properties: {
              error_code: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    loginHandler
  );
}
