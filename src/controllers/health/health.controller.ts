import { randomUUID } from 'node:crypto';

import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '@src/config/env.js';
import { prisma } from '@src/config/database.js';
import { logger } from '@src/config/logger.js';

export interface HealthCheck {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  error?: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  service: string;
  version: string;
  checks: {
    sqlserver: HealthCheck;
    mongodb: HealthCheck;
    s3: HealthCheck;
    secretsManager: HealthCheck;
  };
}

function formatHealthCheck(result: PromiseSettledResult<HealthCheck>): HealthCheck {
  if (result.status === 'fulfilled') {
    return result.value;
  }
  return {
    status: 'down',
    responseTime: 0,
    error: result.reason?.message ?? String(result.reason)
  };
}

function determineOverallStatus(
  results: PromiseSettledResult<HealthCheck>[]
): HealthStatus['status'] {
  const checks = results.map((r) =>
    r.status === 'fulfilled' ? r.value : { status: 'down' as const, responseTime: 0 }
  );
  const hasDown = checks.some((c) => c.status === 'down');
  const hasDegraded = checks.some((c) => c.status === 'degraded');
  if (hasDown) return 'unhealthy';
  if (hasDegraded) return 'degraded';
  return 'healthy';
}

async function checkSQLServerHealth(): Promise<HealthCheck> {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1 as health_check`;
    return {
      status: 'up',
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    logger.error({ err: error }, 'SQL Server health check failed');
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function checkMongoDBHealth(): Promise<HealthCheck> {
  const startTime = Date.now();
  // Placeholder: MongoDB client not configured yet
  return {
    status: 'degraded',
    responseTime: Date.now() - startTime,
    error: 'Not configured'
  };
}

async function checkS3Health(): Promise<HealthCheck> {
  const startTime = Date.now();
  // Placeholder: S3 client not configured yet
  return {
    status: 'degraded',
    responseTime: Date.now() - startTime,
    error: 'Not configured'
  };
}

async function checkSecretsManagerHealth(): Promise<HealthCheck> {
  const startTime = Date.now();
  // Placeholder: Secrets Manager not configured yet
  return {
    status: 'degraded',
    responseTime: Date.now() - startTime,
    error: 'Not configured'
  };
}

export async function getHealthHandler(request: FastifyRequest, reply: FastifyReply) {
  const correlationId = (request.headers['x-correlation-id'] as string) || randomUUID();
  const startTime = Date.now();
  const log = request.log;

  log.info({ correlationId }, 'Starting health check');

  try {
    const [sqlServerCheck, mongoCheck, s3Check, secretsCheck] = await Promise.allSettled([
      checkSQLServerHealth(),
      checkMongoDBHealth(),
      checkS3Health(),
      checkSecretsManagerHealth()
    ]);

    const healthStatus: HealthStatus = {
      status: determineOverallStatus([sqlServerCheck, mongoCheck, s3Check, secretsCheck]),
      timestamp: new Date(),
      service: env.SERVICE_NAME,
      version: env.SERVICE_VERSION,
      checks: {
        sqlserver: formatHealthCheck(sqlServerCheck),
        mongodb: formatHealthCheck(mongoCheck),
        s3: formatHealthCheck(s3Check),
        secretsManager: formatHealthCheck(secretsCheck)
      }
    };

    const processingTime = Date.now() - startTime;

    log.info(
      {
        correlationId,
        healthStatus: healthStatus.status,
        processingTime: `${processingTime}ms`,
        checks: Object.entries(healthStatus.checks).map(([service, check]) => ({
          service,
          status: check.status
        }))
      },
      'Health check completed'
    );

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    reply.status(statusCode).send(healthStatus);
  } catch (error) {
    const processingTime = Date.now() - startTime;

    log.error(
      {
        err: error,
        correlationId,
        processingTime: `${processingTime}ms`
      },
      'Health check failed'
    );

    reply.status(503).send({
      status: 'unhealthy',
      timestamp: new Date(),
      service: env.SERVICE_NAME,
      version: env.SERVICE_VERSION,
      error: 'Health check failed'
    });
  }
}
