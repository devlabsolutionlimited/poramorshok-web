import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getStudentProfile, 
  updateStudentProfile,
  updateNotificationPreferences
} from '@/lib/api/student-profile';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile } from '@/types/student';

export function useStudentProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['student-profile'],
    queryFn: getStudentProfile
  });

  const updateMutation = useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  });

  const notificationMutation = useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update preferences',
        variant: 'destructive',
      });
    }
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: updateMutation.mutate,
    updateNotifications: notificationMutation.mutate,
    isUpdating: updateMutation.isPending || notificationMutation.isPending
  };
}