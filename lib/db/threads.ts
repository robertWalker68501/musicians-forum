import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getThreadsByCategorySlug(slug: string, take = 20) {
  return prisma.thread.findMany({
    take,
    orderBy: [{ isPinned: 'desc' }, { lastPostAt: 'desc' }],
    where: {
      category: { slug },
    },
    include: {
      author: { select: { username: true, displayName: true, imageUrl: true } },
      category: { select: { slug: true, name: true } },
    },
  });
}
