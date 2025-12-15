import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTopThreads } from '@/lib/threads';
import { timeAgo } from '@/lib/utils';

const TopThreads = async () => {
  const [threads] = await Promise.all([getTopThreads()]);

  return (
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
                      {t.isLocked && <Badge variant='outline'>Locked</Badge>}
                    </div>

                    <CardTitle className='text-base leading-snug'>
                      {t.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='text-muted-foreground flex items-center justify-between text-sm'>
                    <span>
                      By <span className='text-foreground'>{authorName}</span>
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
  );
};

export default TopThreads;
