// prisma/seed.threads.ts
import { prisma } from '@/lib/prisma';

async function ensureSystemUser() {
  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: 'system',
        email: 'system@musiciansforum.local',
        username: 'system',
        displayName: 'Forum Team',
        role: 'ADMIN',
      },
    });
  }

  return user;
}

async function main() {
  const forum = await prisma.forum.findUnique({
    where: { slug: 'musicians-forum' },
    include: { categories: true },
  });

  if (!forum) {
    throw new Error('Forum not found. Run forum seed first.');
  }

  const user = await ensureSystemUser();

  const threads = [
    {
      categorySlug: 'introductions',
      title: 'Welcome! Introduce yourself to the community 👋',
      body:
        'Tell us what you play, what you’re working on, and what brought you here. ' +
        'Whether you’re a hobbyist or a pro, you’re welcome.',
      isPinned: true,
    },
    {
      categorySlug: 'recording',
      title: 'Best DAW in 2025 — what are you using and why?',
      body:
        'Curious what everyone is using these days. Logic, Pro Tools, Ableton, Reaper, Studio One? ' +
        'What keeps you loyal?',
    },
    {
      categorySlug: 'gear',
      title: 'What’s the most overrated piece of gear you’ve owned?',
      body: 'No brand bashing — just honest experiences. Sometimes the hype doesn’t match reality.',
    },
    {
      categorySlug: 'gig-life',
      title: 'Worst gig stories (and what you learned from them)',
      body: 'Bad sound, no crowd, wrong venue — we’ve all been there. Share the pain and the lessons.',
    },
    {
      categorySlug: 'industry',
      title: 'How are you handling streaming payouts in 2025?',
      body: 'Are you focusing on volume, merch, sync, live shows, Patreon, or something else?',
    },
    {
      categorySlug: 'songwriting',
      title: 'How do you break writer’s block?',
      body: 'Looking for practical techniques — prompts, restrictions, collaboration, routine changes.',
    },
    {
      categorySlug: 'feedback',
      title: 'How do you give constructive feedback without killing the vibe?',
      body: 'Especially in band or collaboration settings — what works and what doesn’t?',
    },
    {
      categorySlug: 'collaboration',
      title: 'Looking for collaborators: what info should you include?',
      body: 'Genre, location, goals, influences? Let’s establish some best practices.',
    },
  ];

  for (const t of threads) {
    const category = forum.categories.find((c) => c.slug === t.categorySlug);
    if (!category) continue;

    // Prevent duplicates by title + category
    const existing = await prisma.thread.findFirst({
      where: {
        title: t.title,
        categoryId: category.id,
      },
    });

    if (existing) continue;

    const thread = await prisma.thread.create({
      data: {
        title: t.title,
        categoryId: category.id,
        authorId: user.id,
        isPinned: t.isPinned ?? false,
        posts: {
          create: {
            body: t.body,
            authorId: user.id,
          },
        },
        replyCount: 0,
        lastPostAt: new Date(),
      },
    });

    console.log(`🧵 Created thread: ${thread.title}`);
  }

  console.log('✅ Thread seed complete.');
}

main()
  .catch((err) => {
    console.error('❌ Thread seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
