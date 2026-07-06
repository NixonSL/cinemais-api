import { FastifyPluginAsync } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';

export const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    const validationError = error as { validation?: unknown };
    if (validationError.validation) {
      return reply.status(400).send({
        message: 'Validation failed',
        errors: validationError.validation,
      });
    }

    app.log.error(error);
    return reply.status(500).send({ message: 'Internal server error' });
  });
};
