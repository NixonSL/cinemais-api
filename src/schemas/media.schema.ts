import { z } from 'zod';

export const createMediaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['movie', 'series']),
  releaseYear: z.number().int().min(1888).max(2100),
  genre: z.string().min(1),
});

export type CreateMediaInput = z.infer<typeof createMediaSchema>;

export const mediaIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type MediaResponse = {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'series';
  releaseYear: number;
  genre: string;
};
