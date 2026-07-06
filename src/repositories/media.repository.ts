import { Media, MediaType, PrismaClient } from '@prisma/client';
import { CreateMediaInput } from '../schemas/media.schema.js';

export class MediaRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: CreateMediaInput): Promise<Media> {
    return this.db.media.create({
      data: {
        ...data,
        type: data.type as MediaType,
      },
    });
  }

  async findAll(): Promise<Media[]> {
    return this.db.media.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<Media | null> {
    return this.db.media.findUnique({ where: { id } });
  }
}
