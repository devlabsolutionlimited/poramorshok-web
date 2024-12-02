import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePaymentMethods } from '@/hooks/api/usePaymentMethods';
import { Building2, Smartphone, Star, Trash2, AlertCircle } from 'lucide-react';
import { StatusModal } from '@/components/ui/status-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// ... (keep the existing interfaces and schema)

export default function PaymentMethods({ paymentMethods = [] }: PaymentMethodsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    methodId: string | null;
  }>({ open: false, methodId: null });
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    status: 'loading' | 'success' | 'error';
    message?: string;
  }>({
    isOpen: false,
    status: 'loading'
  });

  const { 
    add: addPaymentMethod, 
    update: updatePaymentMethod,
    delete: deletePaymentMethod,
    isAdding,
    isUpdating,
    isDeleting 
  } = usePaymentMethods();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'bkash',
    },
  });

  const onSubmit = async (data: z.infer<typeof paymentMethodSchema>) => {
    try {
      // Validate mobile number format for mobile banking methods
      if (data.type !== 'bank' && data.number) {
        if (!/^01[3-9]\d{8}$/.test(data.number)) {
          form.setError('number', {
            type: 'manual',
            message: 'Please enter a valid mobile number'
          });
          return;
        }
      }

      setStatusModal({
        isOpen: true,
        status: 'loading',
        message: 'Adding payment method...'
      });

      await addPaymentMethod(data);
      
      setStatusModal({
        isOpen: true,
        status: 'success',
        message: 'Payment method added successfully'
      });

      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      setStatusModal({
        isOpen: true,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to add payment method'
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setStatusModal({
        isOpen: true,
        status: 'loading',
        message: 'Setting as default...'
      });

      await updatePaymentMethod({ 
        id, 
        data: { isDefault: true } 
      });

      setStatusModal({
        isOpen: true,
        status: 'success',
        message: 'Default payment method updated'
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to update default method'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setStatusModal({
        isOpen: true,
        status: 'loading',
        message: 'Deleting payment method...'
      });

      await deletePaymentMethod(id);
      
      setStatusModal({
        isOpen: true,
        status: 'success',
        message: 'Payment method deleted successfully'
      });

      setDeleteConfirm({ open: false, methodId: null });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete payment method'
      });
    }
  };

  // ... (keep the rest of the component code, including the JSX)

  return (
    <div className="space-y-6">
      {/* ... (keep existing JSX) ... */}

      {/* Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        status={statusModal.status}
        message={statusModal.message}
      />

      {/* ... (keep existing modals) ... */}
    </div>
  );
}