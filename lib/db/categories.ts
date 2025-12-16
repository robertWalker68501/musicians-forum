import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      position: true,
      isLocked: true,
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isLocked: true,
    },
  });
}
