import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '@src/config/env.js';

export async function getHealthHandler(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({
    status: 'ok',
    service: env.SERVICE_NAME,
    version: process.env.npm_package_version ?? '0.1.0',
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
}
