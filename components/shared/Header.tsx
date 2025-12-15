import Navbar from '@/components/shared/navigation/Navbar';

const Header = ({ isAuthed }: { isAuthed: boolean }) => {
  return (
    <header>
      <div className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
        <Navbar isAuthed={isAuthed} />
      </div>
    </header>
  );
};

export default Header;
