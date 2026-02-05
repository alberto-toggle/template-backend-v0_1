import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthLoginDto } from '@src/dto/auth/login.dto.js';
import { generateAccessToken, validateExternalCredentials } from '@src/services/auth/auth.service.js';
import { getUserByEmail } from '@src/services/users/user.service.js';
import { listModulePermissionsByUserId } from '@src/services/module-permissions/module-permission.service.js';

const ERROR_INVALID_CREDENTIALS = { error_code: 'INVALID_CREDENTIALS' };
const ERROR_USER_NOT_REGISTERED = { error_code: 'USER_NOT_REGISTERED' };
const ERROR_USER_NOT_ACTIVE = { error_code: 'USER_NOT_ACTIVE' };
const ERROR_NO_PERMISSIONS = { error_code: 'NO_PERMISSIONS' };

export async function loginHandler(
  request: FastifyRequest<{ Body: AuthLoginDto }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const externalAuth = await validateExternalCredentials(email, password);
  if (!externalAuth.ok) {
    reply.code(401).send({ ...ERROR_INVALID_CREDENTIALS, message: 'credenciales inválidas' });
    return;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    reply
      .code(404)
      .send({ ...ERROR_USER_NOT_REGISTERED, message: 'usuario no registrado en BackOffice' });
    return;
  }

  if (user.status !== 'ACTIVE') {
    reply.code(403).send({ ...ERROR_USER_NOT_ACTIVE, message: 'usuario no activo' });
    return;
  }

  const permissions = await listModulePermissionsByUserId(user.id);
  const modules = permissions.map((p) => p.moduleCode);
  if (modules.length === 0) {
    reply.code(403).send({ ...ERROR_NO_PERMISSIONS, message: 'sin permisos para acceder' });
    return;
  }

  const { token, expiresIn } = generateAccessToken({
    user_id: user.id,
    email: user.email,
    status: user.status,
    modules,
    ad_object_id: user.adObjectId ?? null
  });

  reply.send({
    access_token: token,
    expires_in: expiresIn,
    modules
  });
}
