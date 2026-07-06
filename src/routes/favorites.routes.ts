import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { MediaRepository } from '../repositories/media.repository.js';
import { FavoritesRepository } from '../repositories/favorites.repository.js';
import { FavoritesService } from '../services/favorites.service.js';
import {
  addFavoriteSchema,
  favoriteParamsSchema,
  userIdParamSchema,
} from '../schemas/favorites.schema.js';

const mediaRepository = new MediaRepository(prisma);
const favoritesRepository = new FavoritesRepository(prisma);
const favoritesService = new FavoritesService(favoritesRepository, mediaRepository);

export const favoritesRoutes: FastifyPluginAsync = async (app) => {
  app.post('/:userId/favorites', async (request, reply) => {
    const { userId } = userIdParamSchema.parse(request.params);
    const { mediaId } = addFavoriteSchema.parse(request.body);

    await favoritesService.add(userId, mediaId);
    return reply.status(204).send();
  });

  app.get('/:userId/favorites', async (request) => {
    const { userId } = userIdParamSchema.parse(request.params);
    return favoritesService.list(userId);
  });

  app.delete('/:userId/favorites/:mediaId', async (request, reply) => {
    const { userId, mediaId } = favoriteParamsSchema.parse(request.params);

    await favoritesService.remove(userId, mediaId);
    return reply.status(204).send();
  });
};
