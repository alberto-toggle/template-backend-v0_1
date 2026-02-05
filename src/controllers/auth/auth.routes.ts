import type { FastifyInstance } from 'fastify';
import { loginHandler, meHandler, permissionsHandler } from '@src/controllers/auth/auth.controller.js';

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
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  access_token: { type: 'string' },
                  expires_in: { type: 'number' },
                  modules: { type: 'array', items: { type: 'string' } }
                }
              },
              meta: { type: 'object' },
              pagination: { type: 'object' }
            }
          },
          401: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              error_code: { type: 'string' },
              details: {},
              meta: { type: 'object' }
            }
          },
          403: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              error_code: { type: 'string' },
              details: {},
              meta: { type: 'object' }
            }
          },
          
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
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  user_id: { type: 'string' },
                  email: { type: 'string' },
                  status: { type: 'string' },
                  ad_object_id: { type: ['string', 'null'] },
                  modules: { type: 'array', items: { type: 'string' } }
                }
              },
              meta: { type: 'object' },
              pagination: { type: 'object' }
            }
          },
          401: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              error_code: { type: 'string' },
              details: {},
              meta: { type: 'object' }
            }
          },
          403: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              error_code: { type: 'string' },
              details: {},
              meta: { type: 'object' }
            }
          }
        }
      }
    },
    meHandler
  );

  fastify.get(
    '/api/v1/auth/permissions',
    {
      preHandler: fastify.authenticate,
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  user_id: { type: 'string' },
                  modules: { type: 'array', items: { type: 'string' } }
                }
              },
              meta: { type: 'object' },
              pagination: { type: 'object' }
            }
          },
          401: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              error_code: { type: 'string' },
              details: {},
              meta: { type: 'object' }
            }
          },
          403: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              http_status: { type: 'number' },
              message: { type: 'string' },
              error_code: { type: 'string' },
              details: {},
              meta: { type: 'object' }
            }
          }
        }
      }
    },
    permissionsHandler
  );
}
