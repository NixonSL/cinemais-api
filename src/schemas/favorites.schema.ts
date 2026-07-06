import { z } from 'zod';

export const addFavoriteSchema = z.object({
  mediaId: z.string().uuid(),
});

export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;

export const userIdParamSchema = z.object({
  userId: z.string().min(1),
});

export const favoriteParamsSchema = z.object({
  userId: z.string().min(1),
  mediaId: z.string().uuid(),
});
