import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPaymentMethods, 
  addPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod 
} from '@/lib/api/payments';
import { useToast } from '@/hooks/use-toast';
import type { PaymentMethod } from '@/types/payment';

export function usePaymentMethods() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods
  });

  const addMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: (newMethod) => {
      // Update cache optimistically
      queryClient.setQueryData<PaymentMethod[]>(['payment-methods'], (old = []) => {
        return [...old, newMethod];
      });
      
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentMethod> }) => 
      updatePaymentMethod(id, data),
    onSuccess: (updatedMethod) => {
      queryClient.setQueryData<PaymentMethod[]>(['payment-methods'], (old = []) => {
        return old.map(method => 
          method.id === updatedMethod.id ? updatedMethod : method
        );
      });
      
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

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<PaymentMethod[]>(['payment-methods'], (old = []) => {
        return old.filter(method => method.id !== deletedId);
      });
      
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

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    add: addMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}