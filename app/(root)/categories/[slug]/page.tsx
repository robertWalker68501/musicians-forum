import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCategoryBySlug } from '@/lib/db/categories';
import { getThreadsByCategorySlug } from '@/lib/db/threads';
import { timeAgo } from '@/lib/utils';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const threads = await getThreadsByCategorySlug(slug, 30);

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-semibold'>{category.name}</h1>
            {category.isLocked && <Badge variant='outline'>Locked</Badge>}
          </div>
          <p className='text-muted-foreground text-sm'>
            {category.description ?? 'Browse threads and join the discussion.'}
          </p>
        </div>

        <div className='flex gap-2'>
          <Button
            asChild
            variant='outline'
          >
            <Link href='/categories'>All categories</Link>
          </Button>

          {/* Later: make this auth-required + disabled if category is locked */}
          <Button asChild>
            <Link href={`/categories/${category.slug}/new`}>New thread</Link>
          </Button>
        </div>
      </div>

      <Separator className='my-6' />

      {threads.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>No threads yet</CardTitle>
          </CardHeader>
          <CardContent className='text-muted-foreground text-sm'>
            Be the first to start a conversation in{' '}
            <span className='text-foreground'>{category.name}</span>.
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4'>
          {threads.map((thread) => {
            const authorName =
              thread.author.displayName || thread.author.username || 'Unknown';
            return (
              <Link
                key={thread.id}
                href={`/threads/${thread.id}`}
                className='group'
              >
                <Card className='transition-shadow group-hover:shadow-md'>
                  <CardHeader className='space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                      {thread.isPinned && <Badge>Pinned</Badge>}
                      {thread.isLocked && (
                        <Badge variant='outline'>Locked</Badge>
                      )}
                    </div>

                    <CardTitle className='text-base leading-snug'>
                      {thread.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className='text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
                    <span>
                      By <span className='text-foreground'>{authorName}</span>
                    </span>
                    <span className='flex items-center gap-3'>
                      <span>{thread.replyCount} replies</span>
                      <span>•</span>
                      <span>{timeAgo(thread.lastPostAt)}</span>
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
