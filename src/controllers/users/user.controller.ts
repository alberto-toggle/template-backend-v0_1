import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateUserDto } from '@src/dto/users/create-user.dto.js';
import { createUser, getUserById } from '@src/services/users/user.service.js';

export async function createUserHandler(
  request: FastifyRequest<{ Body: CreateUserDto }>,
  reply: FastifyReply
) {
  const user = await createUser(request.body);
  reply.code(201).send(user);
}

export async function getUserByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const user = await getUserById(request.params.id);

  if (!user) {
    reply.code(404).send({ message: 'User not found' });
    return;
  }

  reply.send(user);
}
