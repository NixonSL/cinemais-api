import { FastifyPluginAsync } from 'fastify';
import jwt from '@fastify/jwt';

export const authPlugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  // Decorate request with user property
  app.decorateRequest('user', null);

  // Add authentication hook
  app.addHook('onRequest', async (request, reply) => {
    // Skip authentication for public routes
    const publicRoutes = ['/health', '/docs', '/media', '/users'];
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

// Type augmentation for TypeScript
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      userId: string;
      [key: string]: unknown;
    } | null;
  }
}
