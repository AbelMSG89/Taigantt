import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, LoginRequest } from '@/features/auth/models/auth';
import { AuthService } from '@/features/auth/services/auth.service';
import { isAuthenticated as checkAuth, clearAuthData } from '@/utils/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Omit<LoginRequest, 'type'>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = checkAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing auth:', error);
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated]);

  const login = async (credentials: Omit<LoginRequest, 'type'>) => {
    setIsLoading(true);
    try {
      const response = await AuthService.normalLogin(credentials);
      setUser(response);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    window.location.reload();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}