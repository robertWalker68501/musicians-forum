import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getTopCategories() {
  return prisma.category.findMany({
    take: 6,
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
    select: { slug: true, name: true, description: true },
  });
}
