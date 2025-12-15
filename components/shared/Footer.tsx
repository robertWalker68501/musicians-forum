import Link from 'next/link';

import { Separator } from '@/components/ui/separator';

const SiteFooter = () => {
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

export default SiteFooter;
