import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Optional server action stub (wire to email provider later)
async function subscribeToNewsletter(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  if (!email || !email.includes('@')) return;
  // TODO: save to DB or send to email tool (Buttondown/Mailchimp/Resend/etc)
}

const NewsLetterSignUp = () => {
  return (
    <section className='bg-muted/30 border-t'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid gap-8 md:grid-cols-2 md:items-center'>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold'>
              Get the best discussions weekly
            </h3>
            <p className='text-muted-foreground text-sm'>
              A short email with top threads, community picks, and music
              industry highlights.
            </p>
          </div>

          <form
            action={subscribeToNewsletter}
            className='flex w-full gap-2'
          >
            <Input
              name='email'
              type='email'
              placeholder='you@example.com'
              autoComplete='email'
              required
            />
            <Button type='submit'>Subscribe</Button>
          </form>
        </div>

        <p className='text-muted-foreground mt-3 text-xs'>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsLetterSignUp;
