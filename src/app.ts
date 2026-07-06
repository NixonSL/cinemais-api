import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { mediaRoutes } from './routes/media.routes.js';
import { favoritesRoutes } from './routes/favorites.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

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
