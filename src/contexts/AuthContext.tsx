import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi, register as registerApi, getCurrentUser, logout as logoutApi } from '@/lib/auth';
import type { LoginCredentials, RegisterData, User } from '@/types/auth';
import api from '@/lib/http';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const user = await getCurrentUser();
          setUser(user);
        } catch (error) {
          logoutApi();
          navigate('/login', { 
            replace: true,
            state: { from: location }
          });
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [navigate, location]);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginApi(credentials);
    setUser(response.user);
    
    // Navigate to the protected page the user tried to visit or dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const register = async (data: RegisterData) => {
    const response = await registerApi(data);
    setUser(response.user);
    navigate('/dashboard', { replace: true });
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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