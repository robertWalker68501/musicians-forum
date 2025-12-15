import { ReactNode } from 'react';

import { auth } from '@clerk/nextjs/server';

import SiteFooter from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

const Layout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  return (
    <div>
      <Header isAuthed={!!userId} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
};

export default Layout;
