'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { ReplySchema, type ReplyInput } from '@/lib/validators/reply';

export async function createReply(input: ReplyInput) {
  const parsed = ReplySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input.',
    };
  }

  const { threadId, body } = parsed.data;

  const { userId: clerkId } = await auth();
  if (!clerkId) return { ok: false, error: 'You must be signed in to reply.' };

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!dbUser) return { ok: false, error: 'User not found in database.' };

  // Make sure replies are allowed (thread/category lock)
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: {
      id: true,
      isLocked: true,
      category: { select: { isLocked: true, slug: true } },
    },
  });

  if (!thread) return { ok: false, error: 'Thread not found.' };
  if (thread.isLocked || thread.category.isLocked) {
    return { ok: false, error: 'This thread is locked.' };
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.post.create({
      data: {
        threadId,
        authorId: dbUser.id,
        body,
      },
    });

    await tx.thread.update({
      where: { id: threadId },
      data: {
        replyCount: { increment: 1 },
        lastPostAt: now,
      },
    });
  });

  // Revalidate the thread page (and optionally category listing)
  revalidatePath(`/threads/${threadId}`);
  revalidatePath(`/categories/${thread.category.slug}`);

  return { ok: true };
}
