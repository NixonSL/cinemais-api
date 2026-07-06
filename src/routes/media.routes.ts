import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { MediaRepository } from '../repositories/media.repository.js';
import { MediaService } from '../services/media.service.js';
import { createMediaSchema, mediaIdParamSchema } from '../schemas/media.schema.js';

const mediaRepository = new MediaRepository(prisma);
const mediaService = new MediaService(mediaRepository);

export const mediaRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Media'],
        description: 'Adiciona um novo item (filme ou série) ao catálogo',
        body: {
          type: 'object',
          required: ['title', 'description', 'type', 'releaseYear', 'genre'],
          properties: {
            title: { type: 'string', description: 'Título da mídia' },
            description: { type: 'string', description: 'Descrição da mídia' },
            type: { type: 'string', enum: ['movie', 'series'], description: 'Tipo da mídia' },
            releaseYear: { type: 'integer', minimum: 1888, maximum: 2100, description: 'Ano de lançamento' },
            genre: { type: 'string', description: 'Gênero da mídia' },
          },
        },
        response: {
          201: {
            description: 'Mídia criada com sucesso',
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
    async (request, reply) => {
      const body = createMediaSchema.parse(request.body);
      const media = await mediaService.create(body);
      return reply.status(201).send(media);
    },
  );

  app.get(
    '/',
    {
      schema: {
        tags: ['Media'],
        description: 'Lista todos os itens de mídia disponíveis no catálogo',
        response: {
          200: {
            description: 'Lista de mídias',
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
    async () => {
      return mediaService.findAll();
    },
  );

  app.get(
    '/:id',
    {
      schema: {
        tags: ['Media'],
        description: 'Busca um item de mídia específico pelo seu id',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'ID da mídia' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Mídia encontrada',
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
    async (request) => {
      const { id } = mediaIdParamSchema.parse(request.params);
      return mediaService.findById(id);
    },
  );
};
