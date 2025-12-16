import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getThreadById(args: {
  threadId: string;
  includeHidden: boolean;
}) {
  const { threadId, includeHidden } = args;

  return prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      category: { select: { name: true, slug: true, isLocked: true } },
      author: { select: { username: true, displayName: true, imageUrl: true } },
      posts: {
        where: includeHidden ? {} : { isHidden: false },
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: { username: true, displayName: true, imageUrl: true },
          },
        },
      },
    },
  });
}

export async function getViewerRoleByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { role: true },
  });
  return user?.role ?? 'USER';
}
