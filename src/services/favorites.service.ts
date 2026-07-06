import { FavoritesRepository } from '../repositories/favorites.repository.js';
import { MediaRepository } from '../repositories/media.repository.js';
import { NotFoundError } from '../errors/app-error.js';
import { MediaResponse } from '../schemas/media.schema.js';

function toMediaResponse(media: {
  id: string;
  title: string;
  description: string;
  type: string;
  releaseYear: number;
  genre: string;
}): MediaResponse {
  return {
    id: media.id,
    title: media.title,
    description: media.description,
    type: media.type as 'movie' | 'series',
    releaseYear: media.releaseYear,
    genre: media.genre,
  };
}

export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async add(userId: string, mediaId: string): Promise<void> {
    const media = await this.mediaRepository.findById(mediaId);

    if (!media) {
      throw new NotFoundError('Media not found');
    }

    await this.favoritesRepository.add(userId, mediaId);
  }

  async list(userId: string): Promise<MediaResponse[]> {
    const mediaList = await this.favoritesRepository.findByUserId(userId);
    return mediaList.map(toMediaResponse);
  }

  async remove(userId: string, mediaId: string): Promise<void> {
    await this.favoritesRepository.remove(userId, mediaId);
  }
}
