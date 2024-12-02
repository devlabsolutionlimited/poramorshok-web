import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface PaymentMethod {
  id: string;
  type: 'bkash' | 'nagad' | 'bank';
  number?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  sessionId: string;
  studentName: string;
}

interface PaymentStats {
  totalEarnings: number;
  pendingPayouts: number;
  completedSessions: number;
}

const paymentMethodSchema = z.object({
  type: z.enum(['bkash', 'nagad', 'bank']),
  number: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'bank') {
    if (!data.accountName || !data.accountNumber || !data.bankName || !data.branchName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All bank details are required",
      });
      return false;
    }
  } else {
    if (!data.number || !/^01[3-9]\d{8}$/.test(data.number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid mobile number is required",
      });
      return false;
    }
  }
  return true;
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

export default function MentorPayments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'bkash',
      number: '',
      accountName: '',
      accountNumber: '',
      bankName: '',
      branchName: '',
    },
  });

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, transactionsRes, methodsRes] = await Promise.all([
          api.get('/mentor/payments/stats'),
          api.get('/mentor/payments/transactions'),
          api.get('/mentor/payments/methods')
        ]);

        setPaymentStats(statsRes.data);
        setTransactions(transactionsRes.data);
        setPaymentMethods(methodsRes.data);

      } catch (err: any) {
        console.error('Error fetching payment data:', err);
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load payment data. Please try again later.';
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [toast]);

  const onSubmitPaymentMethod = async (data: PaymentMethodForm) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User session not found. Please log in again.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await api.post('/mentor/payments/methods', {
        ...data,
        userId: user.id
      });
      
      setPaymentMethods(prev => [...prev, response.data]);
      setIsAddingPayment(false);
      form.reset();
      
      toast({
        title: "Success",
        description: "Payment method added successfully",
      });
    } catch (err: any) {
      console.error('Error adding payment method:', err);
      
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to add payment method";
      const validationErrors = err?.response?.data?.errors;
      
      setError(errorMessage);

      if (validationErrors) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: (
            <div className="space-y-2">
              <p>{errorMessage}</p>
              <ul className="list-disc pl-4 text-sm">
                {Object.entries(validationErrors).map(([field, message]) => (
                  <li key={field}>{message as string}</li>
                ))}
              </ul>
            </div>
          ),
        });
      } else if (err?.message === "Network Error") {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Unable to reach the server. Please check your internet connection and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <Button variant="outline">Download Statement</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Total Earnings</h3>
              <p className="text-2xl font-bold">{formatCurrency(paymentStats?.totalEarnings || 0)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Pending Payouts</h3>
              <p className="text-2xl font-bold">{formatCurrency(paymentStats?.pendingPayouts || 0)}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Completed Sessions</h3>
              <p className="text-2xl font-bold">{paymentStats?.completedSessions || 0}</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>{transaction.studentName}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell className="capitalize">{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payment Methods</h3>
                <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
                  <DialogTrigger asChild>
                    <Button>Add Payment Method</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to receive payments from your students.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitPaymentMethod)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Method Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
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

                        {form.watch('type') !== 'bank' ? (
                          <FormField
                            control={form.control}
                            name="number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="01XXXXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <>
                            <FormField
                              control={form.control}
                              name="accountName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter account name" {...field} />
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
                                    <Input placeholder="Enter account number" {...field} />
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
                                    <Input placeholder="Enter bank name" {...field} />
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
                                    <Input placeholder="Enter branch name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            'Add Payment Method'
                          )}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold capitalize">{method.type}</p>
                        {method.type === 'bank' ? (
                          <p className="text-sm text-muted-foreground">
                            {method.bankName} - {method.accountNumber}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">{method.number}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
