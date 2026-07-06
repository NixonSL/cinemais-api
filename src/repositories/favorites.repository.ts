import { Media, PrismaClient } from '@prisma/client';

export class FavoritesRepository {
  constructor(private readonly db: PrismaClient) {}

  async add(userId: string, mediaId: string): Promise<void> {
    await this.db.favorite.upsert({
      where: { userId_mediaId: { userId, mediaId } },
      create: { userId, mediaId },
      update: {},
    });
  }

  async findByUserId(userId: string): Promise<Media[]> {
    const favorites = await this.db.favorite.findMany({
      where: { userId },
      include: { media: true },
      orderBy: { media: { createdAt: 'desc' } },
    });

    return favorites.map((favorite) => favorite.media);
  }

  async remove(userId: string, mediaId: string): Promise<void> {
    await this.db.favorite.deleteMany({
      where: { userId, mediaId },
    });
  }
}
