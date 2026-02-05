import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthLoginDto } from '@src/dto/auth/login.dto.js';
import { authenticateWithProvider, generateAccessToken } from '@src/services/auth/auth.service.js';
import { getUserByEmail } from '@src/services/users/user.service.js';
import { listModulePermissionsByUserId } from '@src/services/module-permissions/module-permission.service.js';
import { ErrorCodes } from '@src/constants/error-codes.js';
import { buildError, buildSuccess } from '@src/utils/response-builder.js';
import { ensureActiveUser } from '@src/services/auth/user-access.policy.js';

const ERROR_INVALID_CREDENTIALS = { error_code: ErrorCodes.INVALID_CREDENTIALS };
const ERROR_USER_NOT_REGISTERED = { error_code: ErrorCodes.USER_NOT_REGISTERED };
const ERROR_USER_NOT_ACTIVE = { error_code: ErrorCodes.USER_NOT_ACTIVE };
const ERROR_NO_PERMISSIONS = { error_code: ErrorCodes.NO_PERMISSIONS };
const ERROR_UNAUTHORIZED = { error_code: ErrorCodes.UNAUTHORIZED };

export async function loginHandler(
  request: FastifyRequest<{ Body: AuthLoginDto }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const externalAuth = await authenticateWithProvider({ email, password });
  if (!externalAuth.ok) {
    const status = 401;
    reply.status(status).send(
      buildError({
        status,
        message: 'credenciales inválidas',
        errorCode: ERROR_INVALID_CREDENTIALS.error_code
      })
    );
    return;
  }

  const normalizedEmail = externalAuth.email ?? email.trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    const status = 403;
    reply.status(status).send(
      buildError({
        status,
        message: 'usuario no registrado en BackOffice',
        errorCode: ERROR_USER_NOT_REGISTERED.error_code
      })
    );
    return;
  }

  if (user.status !== 'ACTIVE') {
    const status = 403;
    reply.status(status).send(
      buildError({
        status,
        message: 'usuario no activo',
        errorCode: ERROR_USER_NOT_ACTIVE.error_code
      })
    );
    return;
  }

  const permissions = await listModulePermissionsByUserId(user.id);
  const modules = permissions.map((p) => p.moduleCode);
  if (modules.length === 0) {
    const status = 403;
    reply.status(status).send(
      buildError({
        status,
        message: 'sin permisos para acceder',
        errorCode: ERROR_NO_PERMISSIONS.error_code
      })
    );
    return;
  }

  const { token, expiresIn } = generateAccessToken({
    user_id: user.id,
    email: user.email,
    status: user.status,
    modules,
    ad_object_id: user.adObjectId ?? null
  });

  reply.status(200).send(
    buildSuccess({
      status: 200,
      data: {
        access_token: token,
        expires_in: expiresIn,
        modules
      }
    })
  );
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  const claims = request.auth ?? {};
  const userId = typeof claims.user_id === 'string' ? claims.user_id : null;

  if (!userId) {
    const status = 401;
    reply.status(status).send(
      buildError({
        status,
        message: 'unauthorized',
        errorCode: ERROR_UNAUTHORIZED.error_code
      })
    );
    return;
  }

  const access = await ensureActiveUser(userId);
  if (!access.ok) {
    const status = 403;
    reply.status(status).send(
      buildError({
        status,
        message:
          access.reason === 'USER_NOT_REGISTERED'
            ? 'usuario no registrado en BackOffice'
            : 'usuario no activo',
        errorCode:
          access.reason === 'USER_NOT_REGISTERED'
            ? ERROR_USER_NOT_REGISTERED.error_code
            : ERROR_USER_NOT_ACTIVE.error_code
      })
    );
    return;
  }

  const permissions = await listModulePermissionsByUserId(access.user.id);
  const modules = permissions.map((p) => p.moduleCode);

  reply.status(200).send(
    buildSuccess({
      status: 200,
      data: {
        user_id: access.user.id,
        email: access.user.email,
        status: access.user.status,
        ad_object_id: access.user.adObjectId ?? null,
        modules
      }
    })
  );
}

export async function permissionsHandler(request: FastifyRequest, reply: FastifyReply) {
  const claims = request.auth ?? {};
  const userId = typeof claims.user_id === 'string' ? claims.user_id : null;

  if (!userId) {
    const status = 401;
    reply.status(status).send(
      buildError({
        status,
        message: 'unauthorized',
        errorCode: ERROR_UNAUTHORIZED.error_code
      })
    );
    return;
  }

  const access = await ensureActiveUser(userId);
  if (!access.ok) {
    const status = 403;
    reply.status(status).send(
      buildError({
        status,
        message:
          access.reason === 'USER_NOT_REGISTERED'
            ? 'usuario no registrado en BackOffice'
            : 'usuario no activo',
        errorCode:
          access.reason === 'USER_NOT_REGISTERED'
            ? ERROR_USER_NOT_REGISTERED.error_code
            : ERROR_USER_NOT_ACTIVE.error_code
      })
    );
    return;
  }

  const permissions = await listModulePermissionsByUserId(access.user.id);
  const modules = permissions.map((p) => p.moduleCode);
  if (modules.length === 0) {
    const status = 403;
    reply.status(status).send(
      buildError({
        status,
        message: 'sin permisos para acceder',
        errorCode: ERROR_NO_PERMISSIONS.error_code
      })
    );
    return;
  }

  reply.status(200).send(
    buildSuccess({
      status: 200,
      data: {
        user_id: user.id,
        modules
      }
    })
  );
}
