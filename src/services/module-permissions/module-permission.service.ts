import type { ModulePermission, Prisma } from '@prisma/client';
import { prisma } from '@src/config/database.js';

export async function createModulePermission(
  data: Prisma.ModulePermissionCreateInput
): Promise<ModulePermission> {
  return prisma.modulePermission.create({ data });
}

export async function listModulePermissionsByUserId(
  userId: string
): Promise<ModulePermission[]> {
  return prisma.modulePermission.findMany({
    where: { userId },
    orderBy: { moduleCode: 'asc' }
  });
}
