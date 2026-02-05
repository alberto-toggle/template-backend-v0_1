import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '@src/config/env.js';
import { buildSuccess } from '@src/utils/response-builder.js';

export async function getHealthHandler(_request: FastifyRequest, reply: FastifyReply) {
  const payload = {
    status: 'ok',
    service: env.SERVICE_NAME,
    version: process.env.npm_package_version ?? '0.1.0',
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  };

  reply.status(200).send(
    buildSuccess({
      status: 200,
      data: payload
    })
  );
}
