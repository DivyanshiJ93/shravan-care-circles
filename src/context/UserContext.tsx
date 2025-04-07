
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'parent' | 'kid' | null;
type ThemeMode = 'light' | 'dark';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  parentId?: string; // For kids to link to their parents
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  userRole: UserRole;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  {
    id: 'p1',
    name: 'Raj Sharma',
    role: 'parent' as UserRole,
    email: 'parent@example.com',
    avatar: '/avatar-parent.png'
  },
  {
    id: 'k1',
    name: 'Anika Sharma',
    role: 'kid' as UserRole,
    email: 'kid@example.com',
    avatar: '/avatar-kid.png',
    parentId: 'p1'
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('shravanTheme');
    return (savedTheme as ThemeMode) || 'light';
  });
  
  // Apply theme class to document
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('shravanTheme', themeMode);
  }, [themeMode]);
  
  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('shravanUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // In a real app, validate credentials against a backend
    if (!email || !password) return false;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Here we're just simulating with our mock data
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      setUserRole(foundUser.role);
      localStorage.setItem('shravanUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('shravanUser');
  };
  
  const toggleTheme = () => {
    setThemeMode(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        userRole,
        themeMode,
        toggleTheme
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
