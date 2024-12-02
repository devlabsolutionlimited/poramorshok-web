import { useQuery, useMutation } from '@tanstack/react-query';
import { adminLogin, getAdminUser } from '@/lib/api/admin';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/http';

export function useAdminAuth() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      // Set token in localStorage and axios defaults
      localStorage.setItem('adminToken', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Navigate to admin dashboard
      navigate('/admin');

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { data: adminUser, isLoading } = useQuery({
    queryKey: ['admin-user'],
    queryFn: getAdminUser,
    enabled: !!localStorage.getItem('adminToken'),
    retry: false,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  };

  return {
    adminUser,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout
  };
}