import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getTopThreads() {
  // "Top" for forums usually means "most recently active"
  return prisma.thread.findMany({
    take: 8,
    orderBy: [{ isPinned: 'desc' }, { lastPostAt: 'desc' }],
    include: {
      author: { select: { username: true, displayName: true, imageUrl: true } },
      category: { select: { slug: true, name: true } },
    },
  });
}
