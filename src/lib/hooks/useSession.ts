import { useApi } from './useApi';
import { SessionService } from '@/services/session.service';
import { useToast } from '@/hooks/use-toast';
import type { Session, SessionFeedback } from '@/types/session';

export function useSession() {
  const { toast } = useToast();

  const createSessionApi = useApi(SessionService.create, {
    onSuccess: () => {
      toast({
        title: 'Session Created',
        description: 'Your session has been scheduled successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getUserSessionsApi = useApi(SessionService.getUserSessions);
  const addFeedbackApi = useApi(SessionService.addFeedback);
  const updateStatusApi = useApi(SessionService.updateStatus);

  return {
    createSession: (data: Partial<Session>) => createSessionApi.execute(data),
    getUserSessions: (userId: string) => getUserSessionsApi.execute(userId),
    addFeedback: (sessionId: string, feedback: Partial<SessionFeedback>) => 
      addFeedbackApi.execute(sessionId, feedback),
    updateStatus: (sessionId: string, status: Session['status']) =>
      updateStatusApi.execute(sessionId, status),
    isLoading: {
      create: createSessionApi.isLoading,
      fetch: getUserSessionsApi.isLoading,
      feedback: addFeedbackApi.isLoading,
      status: updateStatusApi.isLoading,
    },
  };
}