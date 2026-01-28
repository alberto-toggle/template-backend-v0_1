import type { FastifyInstance } from 'fastify';

import { createUserHandler, getUserByIdHandler } from '@src/controllers/users/user.controller.js';

export async function registerUserRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/users',
    {
      schema: {
        body: { $ref: 'CreateUserBody' },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              email: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string' }
            }
          }
        }
      }
    },
    createUserHandler
  );

  fastify.get(
    '/users/:id',
    {
      schema: {
        params: { $ref: 'UserIdParams' },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              email: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string' }
            }
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    getUserByIdHandler
  );
}
