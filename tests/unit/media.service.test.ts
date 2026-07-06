import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MediaService } from '../../src/services/media.service.js';
import { MediaRepository } from '../../src/repositories/media.repository.js';
import { NotFoundError } from '../../src/errors/app-error.js';

describe('MediaService', () => {
  const mockRepository = {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
  };

  const service = new MediaService(mockRepository as unknown as MediaRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a media item', async () => {
    const input = {
      title: 'Matrix Genérica',
      description: 'Um dev descobre que o mundo é uma simulação.',
      type: 'movie' as const,
      releaseYear: 2025,
      genre: 'Ficção Científica',
    };

    mockRepository.create.mockResolvedValue({
      id: 'uuid-1',
      ...input,
      createdAt: new Date(),
    });

    const result = await service.create(input);

    expect(mockRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual({
      id: 'uuid-1',
      ...input,
    });
  });

  it('lists all media items', async () => {
    mockRepository.findAll.mockResolvedValue([
      {
        id: 'uuid-1',
        title: 'Matrix Genérica',
        description: 'Desc',
        type: 'movie',
        releaseYear: 2025,
        genre: 'Sci-Fi',
        createdAt: new Date(),
      },
    ]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('uuid-1');
  });

  it('returns media by id', async () => {
    mockRepository.findById.mockResolvedValue({
      id: 'uuid-1',
      title: 'Matrix Genérica',
      description: 'Desc',
      type: 'movie',
      releaseYear: 2025,
      genre: 'Sci-Fi',
      createdAt: new Date(),
    });

    const result = await service.findById('uuid-1');

    expect(result.id).toBe('uuid-1');
  });

  it('throws NotFoundError when media does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.findById('missing-id')).rejects.toBeInstanceOf(NotFoundError);
  });
});
