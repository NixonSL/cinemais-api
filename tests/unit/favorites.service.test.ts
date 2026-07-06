import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FavoritesService } from '../../src/services/favorites.service.js';
import { FavoritesRepository } from '../../src/repositories/favorites.repository.js';
import { MediaRepository } from '../../src/repositories/media.repository.js';
import { NotFoundError } from '../../src/errors/app-error.js';

describe('FavoritesService', () => {
  const mockFavoritesRepository = {
    add: vi.fn(),
    findByUserId: vi.fn(),
    remove: vi.fn(),
  };

  const mockMediaRepository = {
    findById: vi.fn(),
  };

  const service = new FavoritesService(
    mockFavoritesRepository as unknown as FavoritesRepository,
    mockMediaRepository as unknown as MediaRepository,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds a favorite when media exists', async () => {
    mockMediaRepository.findById.mockResolvedValue({
      id: 'media-1',
      title: 'Matrix Genérica',
      description: 'Desc',
      type: 'movie',
      releaseYear: 2025,
      genre: 'Sci-Fi',
      createdAt: new Date(),
    });

    await service.add('user-1', 'media-1');

    expect(mockFavoritesRepository.add).toHaveBeenCalledWith('user-1', 'media-1');
  });

  it('throws NotFoundError when adding favorite for non-existent media', async () => {
    mockMediaRepository.findById.mockResolvedValue(null);

    await expect(service.add('user-1', 'missing-media')).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('lists user favorites', async () => {
    mockFavoritesRepository.findByUserId.mockResolvedValue([
      {
        id: 'media-1',
        title: 'Matrix Genérica',
        description: 'Desc',
        type: 'movie',
        releaseYear: 2025,
        genre: 'Sci-Fi',
        createdAt: new Date(),
      },
    ]);

    const result = await service.list('user-1');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Matrix Genérica');
  });

  it('removes a favorite', async () => {
    await service.remove('user-1', 'media-1');

    expect(mockFavoritesRepository.remove).toHaveBeenCalledWith('user-1', 'media-1');
  });
});
