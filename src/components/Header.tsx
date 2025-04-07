
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export default function Header() {
  const { user, logout, userRole } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    return userRole === 'parent' ? '/parents-dashboard' : '/kids-dashboard';
  };

  const getNavLinks = () => {
    if (userRole === 'parent') {
      return [
        { title: 'Dashboard', path: '/parents-dashboard' },
        { title: 'Vitals Tracker', path: '/vitals-tracker' },
        { title: 'Physio Assistant', path: '/physio-assistant' },
        { title: 'Community', path: '/community' },
      ];
    } else if (userRole === 'kid') {
      return [
        { title: 'Dashboard', path: '/kids-dashboard' },
        { title: 'Vitals Tracker', path: '/vitals-tracker' },
        { title: 'Care Settings', path: '/care-settings' },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <button 
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-shravan-mint flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <span className="hidden md:inline-block font-bold text-xl">SHRAVAN</span>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button 
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.title}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-shravan-lavender">
                  <span className="font-semibold text-accent-foreground">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shravan-lavender">
                  <span className="font-semibold text-accent-foreground">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <button 
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {link.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
