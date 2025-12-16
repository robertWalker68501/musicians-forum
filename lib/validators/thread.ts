import { z } from 'zod';

export const CreateThreadSchema = z.object({
  categorySlug: z.string().min(1, 'Missing category.'),
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters.')
    .max(120, 'Title is too long (max 120 characters).'),
  body: z
    .string()
    .trim()
    .min(10, 'Post must be at least 10 characters.')
    .max(10000, 'Post is too long (max 10,000 characters).'),
});

export type CreateThreadInput = z.infer<typeof CreateThreadSchema>;
