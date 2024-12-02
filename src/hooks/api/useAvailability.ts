import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAvailability, updateAvailability } from '@/lib/api/availability';
import { useToast } from '@/hooks/use-toast';
import type { Availability } from '@/lib/api/availability';

export function useAvailability() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['mentor-availability'],
    queryFn: getAvailability
  });

  const mutation = useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-availability'] });
      toast({
        title: 'Success',
        description: 'Availability settings have been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update availability settings.',
        variant: 'destructive',
      });
    }
  });

  return {
    availability: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateAvailability: mutation.mutate,
    isUpdating: mutation.isPending
  };
}