
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useUser } from '@/context/UserContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { themeMode } = useUser();
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${themeMode === 'light' ? 'page-gradient-light' : 'page-gradient-dark'} p-4`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-24 h-24 rounded-full bg-shravan-mint dark:bg-shravan-darkMint flex items-center justify-center mb-6 animate-float">
        <span className="text-4xl">🔍</span>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
        Oops! We couldn't find the page you're looking for.
      </p>
      
      <Button 
        onClick={() => navigate('/')} 
        className="btn-shravan btn-primary"
      >
        Return to Home
      </Button>
    </div>
  );
}
