import { randomUUID } from 'node:crypto';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserDto } from '@src/dto/users/create-user.dto.js';
import { createUser, getUserById } from '@src/services/users/user.service.js';
import { buildApiError } from '@src/dto/api-error.dto.js';

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserDto }>,
  reply: FastifyReply
) {
  const user = await createUser(request.body);
  reply.code(201).send(user);
}

export async function getUserByIdHandler(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) {
  const user = await getUserById(request.params.id);

  if (!user) {
    const correlationId = (request.headers['x-correlation-id'] as string) || randomUUID();
    reply.code(404).send(
      buildApiError({
        code: 'NOT_FOUND',
        message: 'User not found',
        correlationId
      })
    );
    return;
  }

  reply.send(user);
}
