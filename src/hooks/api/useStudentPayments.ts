import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPaymentHistory, 
  getPaymentStats,
  requestRefund
} from '@/lib/api/student-payments';
import { useToast } from '@/hooks/use-toast';

export function useStudentPayments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const historyQuery = useQuery({
    queryKey: ['student-payment-history'],
    queryFn: getPaymentHistory
  });

  const statsQuery = useQuery({
    queryKey: ['student-payment-stats'],
    queryFn: getPaymentStats
  });

  const refundMutation = useMutation({
    mutationFn: requestRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-payment-history'] });
      queryClient.invalidateQueries({ queryKey: ['student-payment-stats'] });
      toast({
        title: 'Refund Requested',
        description: 'Your refund request has been submitted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to request refund',
        variant: 'destructive',
      });
    }
  });

  return {
    payments: historyQuery.data,
    stats: statsQuery.data,
    isLoading: historyQuery.isLoading || statsQuery.isLoading,
    error: historyQuery.error || statsQuery.error,
    requestRefund: refundMutation.mutate,
    isRequesting: refundMutation.isPending
  };
}