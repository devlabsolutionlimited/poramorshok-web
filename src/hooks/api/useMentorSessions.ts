import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMentorSessions, 
  getSessionStats,
  createSessionType,
  updateSessionType,
  deleteSessionType,
  getSessionTypes,
  updateSessionStatus,
  addSessionFeedback
} from '@/lib/api/sessions';
import { useToast } from '@/hooks/use-toast';
import type { SessionType } from '@/types/session';

export function useMentorSessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sessionsQuery = useQuery({
    queryKey: ['mentor-sessions'],
    queryFn: getMentorSessions,
    staleTime: 0, // Always fetch fresh data
    retry: 3
  });

  const statsQuery = useQuery({
    queryKey: ['session-stats'],
    queryFn: getSessionStats,
    staleTime: 0 // Always fetch fresh data
  });

  const sessionTypesQuery = useQuery({
    queryKey: ['session-types'],
    queryFn: getSessionTypes,
    staleTime: 0 // Always fetch fresh data
  });

  const createSessionTypeMutation = useMutation({
    mutationFn: createSessionType,
    onSuccess: () => {
      // Invalidate both session types and dashboard stats
      queryClient.invalidateQueries({ queryKey: ['session-types'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['session-stats'] });
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

  const updateSessionStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateSessionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-sessions'] });
      toast({
        title: 'Success',
        description: 'Session status updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update session status',
        variant: 'destructive',
      });
    }
  });

  const addSessionFeedbackMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: { rating: number; review: string } }) =>
      addSessionFeedback(id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-sessions'] });
      toast({
        title: 'Success',
        description: 'Feedback added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add feedback',
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
    updateSessionStatus: updateSessionStatusMutation.mutate,
    addSessionFeedback: addSessionFeedbackMutation.mutate,
    isCreating: createSessionTypeMutation.isPending,
    isUpdating: updateSessionTypeMutation.isPending,
    isDeleting: deleteSessionTypeMutation.isPending
  };
}