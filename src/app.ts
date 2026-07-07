import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { sanitizePlugin } from './plugins/sanitize.js';
import { secureLoggerPlugin } from './plugins/secure-logger.js';
import { auditLoggerPlugin } from './plugins/audit-logger.js';
import { authPlugin } from './plugins/auth.js';
import { mediaRoutes } from './routes/media.routes.js';
import { favoritesRoutes } from './routes/favorites.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024, // 10MB limit
  });

  await app.register(secureLoggerPlugin);
  await app.register(auditLoggerPlugin);
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });

  // HTTPS redirect in production
  if (process.env.NODE_ENV === 'production') {
    app.addHook('onRequest', (request, reply, done) => {
      if (request.headers['x-forwarded-proto'] !== 'https') {
        reply.redirect(`https://${request.headers.host}${request.url}`);
      } else {
        done();
      }
    });
  }

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(authPlugin);
  await app.register(sanitizePlugin);
  await app.register(errorHandlerPlugin);

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Cinemais API',
        description: 'API REST para gerenciamento de catálogo de mídias e lista de favoritos',
        version: '1.0.0',
      },
      tags: [
        { name: 'Health', description: 'Health check endpoint' },
        { name: 'Media', description: 'Gerenciamento do catálogo de mídias' },
        { name: 'Favorites', description: 'Gerenciamento da lista de favoritos' },
      ],
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
    },
  });

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(mediaRoutes, { prefix: '/media' });
  await app.register(favoritesRoutes, { prefix: '/users' });

  return app;
}
