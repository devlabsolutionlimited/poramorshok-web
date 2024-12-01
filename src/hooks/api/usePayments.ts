import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPaymentStats,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  requestWithdrawal,
  getWithdrawals,
  getTransactions
} from '@/lib/api/payments';
import { useToast } from '@/hooks/use-toast';
import type { PaymentMethod, WithdrawalRequest } from '@/types/payment';

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
    onError: (error) => {
      console.error('Failed to fetch payment stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment information. Please try again later.',
        variant: 'destructive',
      });
    }
  });

  // Payment Methods Query
  const methodsQuery = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
    retry: 3,
    retryDelay: 1000
  });

  // Transactions Query
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    retry: 3,
    retryDelay: 1000,
    onError: (error) => {
      console.error('Failed to fetch transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transaction history. Please try again later.',
        variant: 'destructive',
      });
    }
  });

  // Withdrawals Query
  const withdrawalsQuery = useQuery({
    queryKey: ['withdrawals'],
    queryFn: getWithdrawals,
    retry: 3,
    retryDelay: 1000
  });

  // Add Payment Method Mutation
  const addMethodMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method added successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add payment method',
        variant: 'destructive',
      });
    }
  });

  // Update Payment Method Mutation
  const updateMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentMethod> }) => 
      updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update payment method',
        variant: 'destructive',
      });
    }
  });

  // Delete Payment Method Mutation
  const deleteMethodMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete payment method',
        variant: 'destructive',
      });
    }
  });

  // Request Withdrawal Mutation
  const withdrawalMutation = useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
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
    // Queries
    stats: statsQuery.data,
    methods: methodsQuery.data,
    transactions: transactionsQuery.data,
    withdrawals: withdrawalsQuery.data,
    isLoading: statsQuery.isLoading || methodsQuery.isLoading || transactionsQuery.isLoading,
    error: statsQuery.error || methodsQuery.error || transactionsQuery.error,

    // Mutations
    addPaymentMethod: addMethodMutation.mutate,
    updatePaymentMethod: updateMethodMutation.mutate,
    deletePaymentMethod: deleteMethodMutation.mutate,
    requestWithdrawal: withdrawalMutation.mutate,

    // Mutation States
    isAdding: addMethodMutation.isPending,
    isUpdating: updateMethodMutation.isPending,
    isDeleting: deleteMethodMutation.isPending,
    isWithdrawing: withdrawalMutation.isPending
  };
}