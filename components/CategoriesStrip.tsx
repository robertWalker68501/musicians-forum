import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTopCategories } from '@/lib/categories';

const CategoriesStrip = async () => {
  const [categories] = await Promise.all([getTopCategories()]);

  return (
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
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className='group'
            >
              <Card className='h-full transition-shadow group-hover:shadow-md'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-base'>{category.name}</CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground text-sm'>
                  {category.description ??
                    'Explore threads and start a new conversation.'}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesStrip;
