
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { themeMode, toggleTheme } = useUser();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full h-10 w-10 ${className}`}
      aria-label="Toggle theme"
    >
      {themeMode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
