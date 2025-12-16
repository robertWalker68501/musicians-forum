import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';

import { CreateThreadForm } from '@/components/forms/create-thread-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryBySlug } from '@/lib/db/categories';

export default async function NewThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='flex items-end justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-semibold'>New thread</h1>
            <Badge variant='secondary'>{category.name}</Badge>
            {category.isLocked && <Badge variant='outline'>Locked</Badge>}
          </div>
          <p className='text-muted-foreground text-sm'>
            Start a new discussion in{' '}
            <span className='text-foreground'>{category.name}</span>.
          </p>
        </div>

        <Button
          asChild
          variant='outline'
        >
          <Link href={`/categories/${category.slug}`}>Back</Link>
        </Button>
      </div>

      <div className='mt-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Thread details</CardTitle>
          </CardHeader>
          <CardContent>
            {category.isLocked ? (
              <p className='text-muted-foreground text-sm'>
                This category is locked. You can’t create new threads right now.
              </p>
            ) : (
              <CreateThreadForm categorySlug={category.slug} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
