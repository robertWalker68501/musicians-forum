import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategories } from '@/lib/db/categories';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Categories</h1>
          <p className='text-muted-foreground text-sm'>
            Browse topics and jump into the conversations.
          </p>
        </div>
      </div>

      <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className='group'
          >
            <Card className='h-full transition-shadow group-hover:shadow-md'>
              <CardHeader className='space-y-2 pb-2'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-base'>{category.name}</CardTitle>
                  {category.isLocked && <Badge variant='outline'>Locked</Badge>}
                </div>
              </CardHeader>
              <CardContent className='text-muted-foreground text-sm'>
                {category.description ??
                  'Explore threads and start a new discussion.'}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
