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

const paymentMethodSchema = z.object({
  type: z.enum(['bkash', 'nagad', 'bank']),
  number: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
}).refine(data => {
  if (data.type === 'bank') {
    return !!data.accountName && !!data.accountNumber && !!data.bankName && !!data.branchName;
  }
  return !!data.number;
}, {
  message: "Please fill in all required fields"
});

interface PaymentMethod {
  id: string;
  type: 'bkash' | 'nagad' | 'bank';
  number?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  isDefault: boolean;
}

interface PaymentMethodsProps {
  paymentMethods?: PaymentMethod[];
}

export default function PaymentMethods({ paymentMethods = [] }: PaymentMethodsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    methodId: string | null;
  }>({ open: false, methodId: null });

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

      await addPaymentMethod(data);
      setIsAddModalOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updatePaymentMethod({ 
        id, 
        data: { isDefault: true } 
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePaymentMethod(id);
      setDeleteConfirm({ open: false, methodId: null });
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const watchType = form.watch('type');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Payment Method</Button>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {method.type === 'bank' ? (
                    <Building2 className="h-8 w-8 text-primary" />
                  ) : (
                    <Smartphone className="h-8 w-8 text-primary" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {method.type === 'bank' ? method.bankName : method.type.toUpperCase()}
                      {method.isDefault && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          (Default)
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {method.type === 'bank'
                        ? `${method.accountName} • ****${method.accountNumber?.slice(-4)}`
                        : `****${method.number?.slice(-4)}`}
                    </p>
                    {method.type === 'bank' && method.branchName && (
                      <p className="text-sm text-muted-foreground">
                        Branch: {method.branchName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={isUpdating}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteConfirm({ 
                      open: true, 
                      methodId: method.id 
                    })}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {paymentMethods.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Payment Methods</h3>
                <p className="text-muted-foreground mb-4">
                  Add a payment method to receive your earnings
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to receive your earnings
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === 'bank' ? (
                <>
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormDescription>
                        Enter your {watchType} registered number
                      </FormDescription>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="01XXXXXXXXX"
                          pattern="^01[3-9]\d{8}$"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Payment Method'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirm.open} 
        onOpenChange={(open) => setDeleteConfirm({ open, methodId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Payment Method
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm.methodId && handleDelete(deleteConfirm.methodId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}