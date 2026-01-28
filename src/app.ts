import Fastify from 'fastify';

import { registerHealthRoutes } from '@src/controllers/health/health.routes.js';
import { registerUserRoutes } from '@src/controllers/users/user.routes.js';
import { logger } from '@src/config/logger.js';
import { registerSwagger } from '@src/config/swagger.js';
import { registerAuthPlugin } from '@src/plugins/auth.plugin.js';
import { registerErrorHandler } from '@src/plugins/error-handler.plugin.js';
import { registerValidationPlugin } from '@src/plugins/validation.plugin.js';

export async function buildApp() {
  const app = Fastify({
    logger,
    ajv: {
      customOptions: {
        allErrors: true,
        coerceTypes: true
      }
    }
  });

  await registerValidationPlugin(app);
  await registerAuthPlugin(app);
  await registerErrorHandler(app);
  await registerSwagger(app);

  await registerHealthRoutes(app);
  await registerUserRoutes(app);

  return app;
}
