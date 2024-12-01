import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPaymentStats, 
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getTransactions,
  requestWithdrawal,
  getWithdrawals
} from '@/lib/api/payments';
import { useToast } from '@/hooks/use-toast';

export function usePayments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Stats Query
  const statsQuery = useQuery({
    queryKey: ['payment-stats'],
    queryFn: getPaymentStats,
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    retryDelay: 1000,
  });

  // Payment Methods Query
  const methodsQuery = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    retryDelay: 1000,
  });

  // Transactions Query
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    staleTime: 1000 * 60, // 1 minute
    retry: 3
  });

  // Withdrawals Query
  const withdrawalsQuery = useQuery({
    queryKey: ['withdrawals'],
    queryFn: getWithdrawals,
    staleTime: 1000 * 60, // 1 minute
    retry: 3
  });

  // Add Payment Method Mutation
  const addPaymentMethodMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add payment method',
        variant: 'destructive',
      });
    }
  });

  // Update Payment Method Mutation
  const updatePaymentMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment method',
        variant: 'destructive',
      });
    }
  });

  // Delete Payment Method Mutation
  const deletePaymentMethodMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete payment method',
        variant: 'destructive',
      });
    }
  });

  // Request Withdrawal Mutation
  const requestWithdrawalMutation = useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast({
        title: 'Success',
        description: 'Withdrawal request submitted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit withdrawal request',
        variant: 'destructive',
      });
    }
  });

  return {
    // Queries
    stats: statsQuery.data,
    methods: methodsQuery.data,
    transactions: transactionsQuery.data,
    withdrawals: withdrawalsQuery.data,
    isLoading: statsQuery.isLoading || methodsQuery.isLoading,
    error: statsQuery.error || methodsQuery.error,

    // Mutations
    addPaymentMethod: addPaymentMethodMutation.mutate,
    updatePaymentMethod: updatePaymentMethodMutation.mutate,
    deletePaymentMethod: deletePaymentMethodMutation.mutate,
    requestWithdrawal: requestWithdrawalMutation.mutate,

    // Loading States
    isAdding: addPaymentMethodMutation.isPending,
    isUpdating: updatePaymentMethodMutation.isPending,
    isDeleting: deletePaymentMethodMutation.isPending,
    isRequesting: requestWithdrawalMutation.isPending
  };
}