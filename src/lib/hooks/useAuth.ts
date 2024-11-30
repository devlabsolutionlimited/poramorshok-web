import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useApi } from './useApi';
import { AuthService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import type { LoginCredentials, RegisterData } from '@/types/auth';

export function useAuth() {
  const context = useContext(AuthContext);
  const { toast } = useToast();

  const loginApi = useApi(AuthService.login, {
    onSuccess: (data) => {
      context?.setUser(data.user);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const registerApi = useApi(AuthService.register, {
    onSuccess: (data) => {
      context?.setUser(data.user);
      toast({
        title: 'Welcome!',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const login = (credentials: LoginCredentials) => loginApi.execute(credentials);
  const register = (data: RegisterData) => registerApi.execute(data);
  const logout = () => {
    AuthService.logout();
    context?.setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return {
    user: context?.user,
    login,
    register,
    logout,
    isLoading: loginApi.isLoading || registerApi.isLoading,
  };
}