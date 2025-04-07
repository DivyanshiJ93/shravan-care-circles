
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-shravan-mint/20 via-white to-shravan-lavender/20 p-4">
      <div className="w-24 h-24 rounded-full bg-shravan-mint flex items-center justify-center mb-6 animate-float">
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
