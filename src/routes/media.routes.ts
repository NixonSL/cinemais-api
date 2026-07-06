import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { MediaRepository } from '../repositories/media.repository.js';
import { MediaService } from '../services/media.service.js';
import { createMediaSchema, mediaIdParamSchema } from '../schemas/media.schema.js';

const mediaRepository = new MediaRepository(prisma);
const mediaService = new MediaService(mediaRepository);

export const mediaRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', async (request, reply) => {
    const body = createMediaSchema.parse(request.body);
    const media = await mediaService.create(body);
    return reply.status(201).send(media);
  });

  app.get('/', async () => {
    return mediaService.findAll();
  });

  app.get('/:id', async (request) => {
    const { id } = mediaIdParamSchema.parse(request.params);
    return mediaService.findById(id);
  });
};
