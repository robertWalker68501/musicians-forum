import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='container mx-auto space-y-4 px-4 py-16 text-center'>
      <h1 className='text-2xl font-semibold'>Category not found</h1>
      <p className='text-muted-foreground text-sm'>
        That category doesn’t exist (or was removed).
      </p>
      <Button
        asChild
        variant='outline'
      >
        <Link href='/categories'>Back to categories</Link>
      </Button>
    </div>
  );
}
