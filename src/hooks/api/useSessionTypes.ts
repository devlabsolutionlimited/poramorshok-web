import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getSessionTypes, 
  createSessionType, 
  updateSessionType, 
  deleteSessionType 
} from '@/lib/api/session-types';
import { useToast } from '@/hooks/use-toast';
import type { SessionType } from '@/types/session';

export function useSessionTypes(mentorId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['session-types', mentorId],
    queryFn: () => getSessionTypes(mentorId!),
    enabled: !!mentorId
  });

  const createMutation = useMutation({
    mutationFn: createSessionType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-types'] });
      toast({
        title: 'Success',
        description: 'Session type created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create session type',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SessionType> }) => 
      updateSessionType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-types'] });
      toast({
        title: 'Success',
        description: 'Session type updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update session type',
        variant: 'destructive',
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSessionType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-types'] });
      toast({
        title: 'Success',
        description: 'Session type deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete session type',
        variant: 'destructive',
      });
    }
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}