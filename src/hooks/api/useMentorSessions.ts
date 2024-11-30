import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMentorSessions, 
  getSessionStats,
  createSessionType,
  updateSessionType,
  deleteSessionType,
  getSessionTypes
} from '@/lib/api/sessions';
import { useToast } from '@/hooks/use-toast';

export function useMentorSessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sessionsQuery = useQuery({
    queryKey: ['mentor-sessions'],
    queryFn: getMentorSessions
  });

  const statsQuery = useQuery({
    queryKey: ['session-stats'],
    queryFn: getSessionStats
  });

  const sessionTypesQuery = useQuery({
    queryKey: ['session-types'],
    queryFn: getSessionTypes
  });

  const createSessionTypeMutation = useMutation({
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

  const updateSessionTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
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

  const deleteSessionTypeMutation = useMutation({
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
    sessions: sessionsQuery.data,
    stats: statsQuery.data,
    sessionTypes: sessionTypesQuery.data,
    isLoading: sessionsQuery.isLoading || statsQuery.isLoading || sessionTypesQuery.isLoading,
    error: sessionsQuery.error || statsQuery.error || sessionTypesQuery.error,
    createSessionType: createSessionTypeMutation.mutate,
    updateSessionType: updateSessionTypeMutation.mutate,
    deleteSessionType: deleteSessionTypeMutation.mutate,
    isCreating: createSessionTypeMutation.isPending,
    isUpdating: updateSessionTypeMutation.isPending,
    isDeleting: deleteSessionTypeMutation.isPending
  };
}