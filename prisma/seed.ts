// prisma/seed.ts
import { prisma } from '@/lib/prisma';

// const prisma = new PrismaClient();

async function main() {
  // 1) Create (or update) the main forum
  const forum = await prisma.forum.upsert({
    where: { slug: 'musicians-forum' },
    create: {
      name: 'Musicians Forum',
      slug: 'musicians-forum',
      description:
        'A community for musicians, producers, engineers, and everyone building a life in music.',
      position: 0,
      isLocked: false,
    },
    update: {
      name: 'Musicians Forum',
      description:
        'A community for musicians, producers, engineers, and everyone building a life in music.',
      position: 0,
      isLocked: false,
    },
  });

  // 2) Seed categories for that forum (idempotent)
  const categories = [
    {
      name: 'Introductions',
      slug: 'introductions',
      description: 'Say hello, share what you play, and meet the community.',
      position: 0,
    },
    {
      name: 'Recording & Mixing',
      slug: 'recording',
      description:
        'Tracking, mixing, mastering, plugins, and studio workflows.',
      position: 1,
    },
    {
      name: 'Gear & Instruments',
      slug: 'gear',
      description: 'Guitars, keys, drums, mics, interfaces, and live rigs.',
      position: 2,
    },
    {
      name: 'Gig Life & Touring',
      slug: 'gig-life',
      description:
        'Booking, venues, setlists, band dynamics, and touring tips.',
      position: 3,
    },
    {
      name: 'Music Industry',
      slug: 'industry',
      description:
        'Streaming, labels, distribution, publishing, rights, and trends.',
      position: 4,
    },
    {
      name: 'Songwriting & Production',
      slug: 'songwriting',
      description: 'Writing, arrangement, collaboration, and creative process.',
      position: 5,
    },
    {
      name: 'Feedback & Critique',
      slug: 'feedback',
      description: 'Share a track, get notes, and help others improve.',
      position: 6,
    },
    {
      name: 'Collaboration',
      slug: 'collaboration',
      description:
        'Find bandmates, features, producers, engineers, and projects.',
      position: 7,
    },
  ] as const;

  for (const c of categories) {
    await prisma.category.upsert({
      // Because Category uses @@unique([forumId, slug])
      where: {
        forumId_slug: {
          forumId: forum.id,
          slug: c.slug,
        },
      },
      create: {
        forumId: forum.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        position: c.position,
        isLocked: false,
      },
      update: {
        name: c.name,
        description: c.description,
        position: c.position,
        isLocked: false,
      },
    });
  }

  console.log(`✅ Seed complete.`);
  console.log(`Forum: ${forum.name} (${forum.slug})`);
  console.log(`Categories: ${categories.length}`);
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
