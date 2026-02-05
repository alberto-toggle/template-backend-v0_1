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
              id: { type: 'string' },
              email: { type: 'string' },
              adObjectId: { type: ['string', 'null'] },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
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
              id: { type: 'string' },
              email: { type: 'string' },
              adObjectId: { type: ['string', 'null'] },
              status: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
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
