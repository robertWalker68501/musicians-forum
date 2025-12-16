'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import {
  CreateThreadSchema,
  type CreateThreadInput,
} from '@/lib/validators/thread';

export async function createThread(input: CreateThreadInput) {
  const parsed = CreateThreadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input.',
    };
  }

  const { categorySlug, title, body } = parsed.data;

  const { userId: clerkId } = await auth();
  if (!clerkId) return { ok: false, error: 'You must be signed in to post.' };

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!dbUser) return { ok: false, error: 'User not found in database.' };

  const category = await prisma.category.findFirst({
    where: { slug: categorySlug },
    select: { id: true, isLocked: true },
  });
  if (!category) return { ok: false, error: 'Category not found.' };
  if (category.isLocked)
    return { ok: false, error: 'This category is locked.' };

  const now = new Date();

  const thread = await prisma.thread.create({
    data: {
      title,
      categoryId: category.id,
      authorId: dbUser.id,
      lastPostAt: now,
      replyCount: 0,
      posts: {
        create: {
          authorId: dbUser.id,
          body,
        },
      },
    },
    select: { id: true },
  });

  // Redirect to the new thread page
  redirect(`/threads/${thread.id}`);
}
