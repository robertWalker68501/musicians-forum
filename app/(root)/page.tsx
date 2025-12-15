import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (day > 0) return `${day}d ago`;
  if (hr > 0) return `${hr}h ago`;
  if (min > 0) return `${min}m ago`;
  return `just now`;
}

async function getTopThreads() {
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

async function getTopCategories() {
  return prisma.category.findMany({
    take: 6,
    orderBy: [{ position: 'asc' }, { name: 'asc' }],
    select: { slug: true, name: true, description: true },
  });
}

// Optional server action stub (wire to email provider later)
async function subscribeToNewsletter(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  if (!email || !email.includes('@')) return;
  // TODO: save to DB or send to email tool (Buttondown/Mailchimp/Resend/etc)
}

export default async function HomePage() {
  const { userId } = await auth();
  const [threads, categories] = await Promise.all([
    getTopThreads(),
    getTopCategories(),
  ]);

  return (
    <div className='flex min-h-dvh flex-col'>
      <SiteNavbar isAuthed={!!userId} />

      <main className='flex-1'>
        {/* HERO */}
        <section className='border-b'>
          <div className='container mx-auto px-4 py-14'>
            <div className='grid gap-10 md:grid-cols-2 md:items-center'>
              <div className='space-y-5'>
                <Badge
                  variant='secondary'
                  className='w-fit'
                >
                  Built for musicians • engineers • producers
                </Badge>

                <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
                  The place to talk shop—gear, gigs, recording, and the music
                  industry.
                </h1>

                <p className='text-muted-foreground text-lg'>
                  Start threads, share wins, ask for help, and keep up with
                  what’s happening in music—without the noise.
                </p>

                <div className='flex flex-wrap gap-3'>
                  <Button
                    asChild
                    size='lg'
                  >
                    <Link href={userId ? '/new' : '/sign-in'}>
                      Start a thread
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size='lg'
                    variant='outline'
                  >
                    <Link href='/#top-threads'>Browse top threads</Link>
                  </Button>
                </div>

                <div className='text-muted-foreground flex flex-wrap gap-2 text-sm'>
                  <span>Popular:</span>
                  <Link
                    className='hover:text-foreground underline underline-offset-4'
                    href='/c/recording'
                  >
                    Recording
                  </Link>
                  <span>•</span>
                  <Link
                    className='hover:text-foreground underline underline-offset-4'
                    href='/c/gear'
                  >
                    Gear
                  </Link>
                  <span>•</span>
                  <Link
                    className='hover:text-foreground underline underline-offset-4'
                    href='/c/industry'
                  >
                    Industry
                  </Link>
                  <span>•</span>
                  <Link
                    className='hover:text-foreground underline underline-offset-4'
                    href='/c/collaboration'
                  >
                    Collaboration
                  </Link>
                </div>
              </div>

              {/* Right-side “preview” card */}
              <Card className='shadow-sm'>
                <CardHeader>
                  <CardTitle className='text-base'>
                    What you can do here
                  </CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground space-y-4 text-sm'>
                  <ul className='space-y-2'>
                    <li>
                      • Ask for mix feedback (with timestamps if you want later)
                    </li>
                    <li>• Share gig stories, tour tips, and booking advice</li>
                    <li>• Discuss gear, plugins, instruments, and workflows</li>
                    <li>
                      • Break down news: streaming, labels, rights, AI, and more
                    </li>
                  </ul>
                  <Separator />
                  <div className='flex items-center justify-between'>
                    <span>New here?</span>
                    <Button
                      asChild
                      variant='secondary'
                      size='sm'
                    >
                      <Link href={userId ? '/c/introductions' : '/sign-up'}>
                        Introduce yourself
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CATEGORIES STRIP (expected on forum home) */}
        <section className='border-b'>
          <div className='container mx-auto px-4 py-10'>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-xl font-semibold'>Browse categories</h2>
                <p className='text-muted-foreground text-sm'>
                  Jump into the topics you care about.
                </p>
              </div>
              <Button
                asChild
                variant='outline'
                size='sm'
              >
                <Link href='/categories'>All categories</Link>
              </Button>
            </div>

            <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/c/${c.slug}`}
                  className='group'
                >
                  <Card className='h-full transition-shadow group-hover:shadow-md'>
                    <CardHeader className='pb-2'>
                      <CardTitle className='text-base'>{c.name}</CardTitle>
                    </CardHeader>
                    <CardContent className='text-muted-foreground text-sm'>
                      {c.description ??
                        'Explore threads and start a new conversation.'}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TOP THREADS */}
        <section id='top-threads'>
          <div className='container mx-auto px-4 py-12'>
            <div className='flex items-end justify-between gap-4'>
              <div>
                <h2 className='text-xl font-semibold'>Top threads</h2>
                <p className='text-muted-foreground text-sm'>
                  Recently active discussions across the forum.
                </p>
              </div>
              <Button
                asChild
                variant='outline'
                size='sm'
              >
                <Link href='/latest'>View all</Link>
              </Button>
            </div>

            <div className='mt-6 grid gap-4 lg:grid-cols-2'>
              {threads.map((t) => {
                const authorName =
                  t.author.displayName || t.author.username || 'Unknown';
                return (
                  <Link
                    key={t.id}
                    href={`/t/${t.id}`}
                    className='group'
                  >
                    <Card className='transition-shadow group-hover:shadow-md'>
                      <CardHeader className='space-y-2'>
                        <div className='flex flex-wrap items-center gap-2'>
                          {t.isPinned && <Badge>Pinned</Badge>}
                          <Badge variant='secondary'>{t.category.name}</Badge>
                          {t.isLocked && (
                            <Badge variant='outline'>Locked</Badge>
                          )}
                        </div>

                        <CardTitle className='text-base leading-snug'>
                          {t.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className='text-muted-foreground flex items-center justify-between text-sm'>
                        <span>
                          By{' '}
                          <span className='text-foreground'>{authorName}</span>
                        </span>
                        <span className='flex items-center gap-3'>
                          <span>{t.replyCount} replies</span>
                          <span>•</span>
                          <span>{timeAgo(t.lastPostAt)}</span>
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className='bg-muted/30 border-t'>
          <div className='container mx-auto px-4 py-12'>
            <div className='grid gap-8 md:grid-cols-2 md:items-center'>
              <div className='space-y-2'>
                <h3 className='text-xl font-semibold'>
                  Get the best discussions weekly
                </h3>
                <p className='text-muted-foreground text-sm'>
                  A short email with top threads, community picks, and music
                  industry highlights.
                </p>
              </div>

              <form
                action={subscribeToNewsletter}
                className='flex w-full gap-2'
              >
                <Input
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  autoComplete='email'
                  required
                />
                <Button type='submit'>Subscribe</Button>
              </form>
            </div>

            <p className='text-muted-foreground mt-3 text-xs'>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteNavbar({ isAuthed }: { isAuthed: boolean }) {
  return (
    <header className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='container mx-auto flex items-center justify-between px-4 py-3'>
        <Link
          href='/'
          className='font-semibold tracking-tight'
        >
          Musicians Forum
        </Link>

        <nav className='text-muted-foreground hidden items-center gap-6 text-sm md:flex'>
          <Link
            className='hover:text-foreground'
            href='/categories'
          >
            Categories
          </Link>
          <Link
            className='hover:text-foreground'
            href='/latest'
          >
            Latest
          </Link>
          <Link
            className='hover:text-foreground'
            href='/about'
          >
            About
          </Link>
        </nav>

        <div className='flex items-center gap-2'>
          <Button
            asChild
            variant='outline'
            size='sm'
          >
            <Link href='/search'>Search</Link>
          </Button>

          {isAuthed ? (
            <Button
              asChild
              size='sm'
            >
              <Link href='/new'>New thread</Link>
            </Button>
          ) : (
            <Button
              asChild
              size='sm'
            >
              <Link href='/sign-in'>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className='border-t'>
      <div className='container mx-auto px-4 py-10'>
        <div className='grid gap-8 md:grid-cols-3'>
          <div className='space-y-2'>
            <div className='font-semibold'>Musicians Forum</div>
            <p className='text-muted-foreground text-sm'>
              A community for musicians, producers, engineers, and everyone
              building a life in music.
            </p>
          </div>

          <div className='text-sm'>
            <div className='font-medium'>Explore</div>
            <ul className='text-muted-foreground mt-2 space-y-1'>
              <li>
                <Link
                  className='hover:text-foreground'
                  href='/categories'
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  className='hover:text-foreground'
                  href='/latest'
                >
                  Latest threads
                </Link>
              </li>
              <li>
                <Link
                  className='hover:text-foreground'
                  href='/guidelines'
                >
                  Community guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div className='text-sm'>
            <div className='font-medium'>Legal</div>
            <ul className='text-muted-foreground mt-2 space-y-1'>
              <li>
                <Link
                  className='hover:text-foreground'
                  href='/privacy'
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  className='hover:text-foreground'
                  href='/terms'
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  className='hover:text-foreground'
                  href='/contact'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className='my-6' />

        <div className='text-muted-foreground flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between'>
          <span>
            © {new Date().getFullYear()} Musicians Forum. All rights reserved.
          </span>
          <span>Built with Next.js • Prisma • Clerk • shadcn/ui</span>
        </div>
      </div>
    </footer>
  );
}
