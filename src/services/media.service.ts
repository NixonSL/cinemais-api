import { MediaRepository } from '../repositories/media.repository.js';
import { NotFoundError } from '../errors/app-error.js';
import { CreateMediaInput, MediaResponse } from '../schemas/media.schema.js';

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

export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async create(input: CreateMediaInput): Promise<MediaResponse> {
    const media = await this.mediaRepository.create(input);
    return toMediaResponse(media);
  }

  async findAll(): Promise<MediaResponse[]> {
    const mediaList = await this.mediaRepository.findAll();
    return mediaList.map(toMediaResponse);
  }

  async findById(id: string): Promise<MediaResponse> {
    const media = await this.mediaRepository.findById(id);

    if (!media) {
      throw new NotFoundError('Media not found');
    }

    return toMediaResponse(media);
  }
}
