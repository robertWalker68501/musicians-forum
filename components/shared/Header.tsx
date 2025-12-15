import Navbar from '@/components/shared/navigation/Navbar';

const Header = ({ isAuthed }: { isAuthed: boolean }) => {
  return (
    <header className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
      <Navbar isAuthed={isAuthed} />
    </header>
  );
};

export default Header;
