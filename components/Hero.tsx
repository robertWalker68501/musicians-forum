import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Hero = async () => {
  const { userId } = await auth();

  return (
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
              Start threads, share wins, ask for help, and keep up with what’s
              happening in music—without the noise.
            </p>

            <div className='flex flex-wrap gap-3'>
              <Button
                asChild
                size='lg'
              >
                <Link href={userId ? '/new' : '/sign-in'}>Start a thread</Link>
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
                href='/categories/recording'
              >
                Recording
              </Link>
              <span>•</span>
              <Link
                className='hover:text-foreground underline underline-offset-4'
                href='/categories/gear'
              >
                Gear
              </Link>
              <span>•</span>
              <Link
                className='hover:text-foreground underline underline-offset-4'
                href='/categories/industry'
              >
                Industry
              </Link>
              <span>•</span>
              <Link
                className='hover:text-foreground underline underline-offset-4'
                href='/categories/collaboration'
              >
                Collaboration
              </Link>
            </div>
          </div>

          {/* Right-side “preview” card */}
          <Card className='shadow-sm'>
            <CardHeader>
              <CardTitle className='text-base'>What you can do here</CardTitle>
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
                  <Link
                    href={userId ? '/categories/introductions' : '/sign-up'}
                  >
                    Introduce yourself
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
