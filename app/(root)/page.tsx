import CategoriesStrip from '@/components/CategoriesStrip';
import Hero from '@/components/Hero';
import NewsLetterSignUp from '@/components/NewsLetterSignUp';
import TopThreads from '@/components/TopThreads';

export default async function HomePage() {
  return (
    <div className='flex min-h-dvh flex-col'>
      <main className='flex-1'>
        <Hero />
        <CategoriesStrip />
        <TopThreads />
        <NewsLetterSignUp />
      </main>
    </div>
  );
}
