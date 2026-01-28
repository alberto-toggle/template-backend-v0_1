import Fastify from 'fastify';

import { registerHealthRoutes } from './controllers/health/health.routes.js';
import { registerUserRoutes } from './controllers/users/user.routes.js';
import { logger } from './config/logger.js';
import { registerSwagger } from './config/swagger.js';
import { registerAuthPlugin } from './plugins/auth.plugin.js';
import { registerErrorHandler } from './plugins/error-handler.plugin.js';
import { registerValidationPlugin } from './plugins/validation.plugin.js';

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
