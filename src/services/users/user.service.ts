import type { Prisma, User } from '@prisma/client';
import { prisma } from '@src/config/database.js';

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data });
}

export async function getUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
