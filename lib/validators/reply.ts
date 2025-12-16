import { z } from 'zod';

export const ReplySchema = z.object({
  threadId: z.string().min(1, 'Missing thread id.'),
  body: z
    .string()
    .trim()
    .min(3, 'Reply must be at least 3 characters.')
    .max(5000, 'Reply is too long (max 5000 characters).'),
});

export type ReplyInput = z.infer<typeof ReplySchema>;
