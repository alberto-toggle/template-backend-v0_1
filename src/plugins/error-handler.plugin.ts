import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      const statusCode = error.statusCode ?? 500;
      reply.status(statusCode).send({
        error: error.name,
        message: error.message,
        statusCode
      });
    }
  );
}
