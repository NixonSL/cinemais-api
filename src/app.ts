import Fastify from 'fastify';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { mediaRoutes } from './routes/media.routes.js';
import { favoritesRoutes } from './routes/favorites.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(errorHandlerPlugin);

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(mediaRoutes, { prefix: '/media' });
  await app.register(favoritesRoutes, { prefix: '/users' });

  return app;
}
