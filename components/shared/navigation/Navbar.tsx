import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Navbar = ({ isAuthed }: { isAuthed: boolean }) => {
  return (
    <nav className='container mx-auto flex items-center justify-between px-4 py-3'>
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
    </nav>
  );
};

export default Navbar;
