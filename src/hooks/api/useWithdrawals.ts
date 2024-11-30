import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestWithdrawal, getWithdrawals } from '@/lib/api/payments';
import { useToast } from '@/hooks/use-toast';

export function useWithdrawals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['withdrawals'],
    queryFn: getWithdrawals
  });

  const withdrawMutation = useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      toast({
        title: 'Success',
        description: 'Withdrawal request submitted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit withdrawal request',
        variant: 'destructive',
      });
    }
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    requestWithdrawal: withdrawMutation.mutate,
    isRequesting: withdrawMutation.isPending
  };
}