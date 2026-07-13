import { FastifyPluginAsync } from 'fastify';
import jwt from '@fastify/jwt';

export const authPlugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  // Add authentication hook
  app.addHook('onRequest', async (request, reply) => {
    // Skip authentication for public routes
    const publicRoutes = ['/api/v1/health', '/docs', '/api/v1/media', '/api/v1/users'];
    const isPublicRoute = publicRoutes.some(route => request.url.startsWith(route));

    if (isPublicRoute) {
      return;
    }

    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });
};
