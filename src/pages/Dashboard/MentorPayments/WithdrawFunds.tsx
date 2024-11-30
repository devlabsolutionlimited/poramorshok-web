import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: string;
  number?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  isDefault: boolean;
}

interface WithdrawFundsProps {
  balance: number;
  paymentMethods?: PaymentMethod[];
}

const withdrawSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine(val => !isNaN(Number(val)), 'Amount must be a number')
    .refine(val => Number(val) >= 1000, 'Minimum withdrawal amount is ৳1,000'),
  paymentMethodId: z.string().min(1, 'Please select a payment method'),
});

export default function WithdrawFunds({ balance, paymentMethods = [] }: WithdrawFundsProps) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: '',
      paymentMethodId: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof withdrawSchema>) => {
    try {
      if (Number(data.amount) > balance) {
        toast({
          title: 'Insufficient Balance',
          description: 'Withdrawal amount cannot exceed your available balance.',
          variant: 'destructive',
        });
        return;
      }

      // API call would go here
      console.log('Processing withdrawal:', data);
      
      setIsSuccessModalOpen(true);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (৳)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Available balance: ৳{balance}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.type === 'bank'
                              ? `${method.bankName} - ${method.accountNumber}`
                              : `${method.type.toUpperCase()} - ${method.number}`}
                            {method.isDefault && ' (Default)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Withdraw Funds
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Withdrawal Request Submitted
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <p>
                  Your withdrawal request has been submitted successfully. Please note:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Processing typically takes 2-3 business days</li>
                  <li>You'll receive a confirmation email once processed</li>
                  <li>The funds will be sent to your selected payment method</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}