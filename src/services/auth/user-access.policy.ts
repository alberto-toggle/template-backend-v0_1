import type { User } from '@prisma/client';
import { getUserById } from '@src/services/users/user.service.js';

export type UserAccessResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'USER_NOT_REGISTERED' | 'USER_NOT_ACTIVE' };

export async function ensureActiveUser(userId: string): Promise<UserAccessResult> {
  const user = await getUserById(userId);
  if (!user) {
    return { ok: false, reason: 'USER_NOT_REGISTERED' };
  }

  if (user.status !== 'ACTIVE') {
    return { ok: false, reason: 'USER_NOT_ACTIVE' };
  }

  return { ok: true, user };
}
