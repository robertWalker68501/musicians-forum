import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ReplyForm } from '@/components/forms/reply-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getThreadById, getViewerRoleByClerkId } from '@/lib/db/thread-detail';
import { timeAgo } from '@/lib/utils';

function displayName(u: {
  displayName: string | null;
  username: string | null;
}) {
  return u.displayName || u.username || 'Unknown';
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const authResult = await auth();
  const viewerId = authResult.userId; // string | null
  const isAuthed = viewerId !== null; // boolean (this is the key)

  let includeHidden = false;
  if (viewerId) {
    const role = await getViewerRoleByClerkId(viewerId);
    includeHidden = role === 'ADMIN' || role === 'MODERATOR';
  }

  const thread = await getThreadById({ threadId: id, includeHidden });
  if (!thread) notFound();

  const threadAuthor = displayName(thread.author);

  return (
    <div className='container mx-auto px-4 py-10'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary'>{thread.category.name}</Badge>
            {thread.isPinned && <Badge>Pinned</Badge>}
            {thread.isLocked && <Badge variant='outline'>Locked</Badge>}
          </div>

          <h1 className='text-2xl leading-tight font-semibold'>
            {thread.title}
          </h1>

          <p className='text-muted-foreground text-sm'>
            Started by <span className='text-foreground'>{threadAuthor}</span> •{' '}
            {timeAgo(thread.createdAt)}
          </p>
        </div>

        <div className='flex gap-2'>
          <Button
            asChild
            variant='outline'
          >
            <Link href={`/categories/${thread.category.slug}`}>
              Back to category
            </Link>
          </Button>
        </div>
      </div>

      <Separator className='my-6' />

      {/* Posts */}
      <div className='grid gap-4'>
        {thread.posts.map((post, idx) => {
          const author = displayName(post.author);

          return (
            <Card key={post.id}>
              <CardHeader className='pb-3'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div className='text-sm'>
                    <span className='font-medium'>{author}</span>
                    <span className='text-muted-foreground'>
                      {' '}
                      • {timeAgo(post.createdAt)}
                    </span>
                    {idx === 0 && (
                      <Badge
                        className='ml-2'
                        variant='secondary'
                      >
                        Original post
                      </Badge>
                    )}
                    {post.isHidden && (
                      <Badge
                        className='ml-2'
                        variant='outline'
                      >
                        Hidden
                      </Badge>
                    )}
                  </div>

                  {/* Placeholder for later: edit/report/mod menu */}
                  <div className='text-muted-foreground text-xs'>
                    #{idx + 1}
                  </div>
                </div>
              </CardHeader>

              <CardContent className='prose prose-neutral dark:prose-invert max-w-none'>
                {/* For MVP: render as plain text (safe). Later: markdown/rich text. */}
                <p className='whitespace-pre-wrap'>{post.body}</p>

                {post.isHidden && post.hiddenReason && (
                  <p className='text-muted-foreground mt-4 text-xs'>
                    Hidden reason: {post.hiddenReason}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reply Section */}
      <div className='mt-10'>
        <Separator className='mb-6' />

        {thread.isLocked || thread.category.isLocked ? (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Replies are disabled</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground text-sm'>
              This thread is locked.
            </CardContent>
          </Card>
        ) : isAuthed ? (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <ReplyForm threadId={thread.id} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Join the conversation</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between'>
              <span>Sign in to reply to this thread.</span>
              <Button asChild>
                <Link href='/sign-in'>Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
