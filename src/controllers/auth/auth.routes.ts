import type { FastifyInstance } from 'fastify';
import { loginHandler, meHandler } from '@src/controllers/auth/auth.controller.js';

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

  fastify.get(
    '/api/v1/auth/me',
    {
      preHandler: fastify.authenticate,
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              user_id: { type: 'string' },
              email: { type: 'string' },
              status: { type: 'string' },
              ad_object_id: { type: ['string', 'null'] },
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
          }
        }
      }
    },
    meHandler
  );
}
