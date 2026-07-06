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
  app.post(
    '/:userId/favorites',
    {
      schema: {
        tags: ['Favorites'],
        description: 'Adiciona um item de mídia à lista de favoritos de um usuário',
        params: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'ID do usuário' },
          },
          required: ['userId'],
        },
        body: {
          type: 'object',
          required: ['mediaId'],
          properties: {
            mediaId: { type: 'string', format: 'uuid', description: 'ID da mídia' },
          },
        },
        response: {
          204: {
            description: 'Favorito adicionado com sucesso',
          },
          404: {
            description: 'Mídia não encontrada',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { userId } = userIdParamSchema.parse(request.params);
      const { mediaId } = addFavoriteSchema.parse(request.body);

      await favoritesService.add(userId, mediaId);
      return reply.status(204).send();
    },
  );

  app.get(
    '/:userId/favorites',
    {
      schema: {
        tags: ['Favorites'],
        description: 'Lista todos os itens da lista de favoritos de um usuário',
        params: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'ID do usuário' },
          },
          required: ['userId'],
        },
        response: {
          200: {
            description: 'Lista de favoritos',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                description: { type: 'string' },
                type: { type: 'string', enum: ['movie', 'series'] },
                releaseYear: { type: 'integer' },
                genre: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { userId } = userIdParamSchema.parse(request.params);
      return favoritesService.list(userId);
    },
  );

  app.delete(
    '/:userId/favorites/:mediaId',
    {
      schema: {
        tags: ['Favorites'],
        description: 'Remove um item de mídia da lista de favoritos de um usuário',
        params: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'ID do usuário' },
            mediaId: { type: 'string', format: 'uuid', description: 'ID da mídia' },
          },
          required: ['userId', 'mediaId'],
        },
        response: {
          204: {
            description: 'Favorito removido com sucesso',
          },
        },
      },
    },
    async (request, reply) => {
      const { userId, mediaId } = favoriteParamsSchema.parse(request.params);

      await favoritesService.remove(userId, mediaId);
      return reply.status(204).send();
    },
  );
};
