import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentMethods from './PaymentMethods';
import WithdrawFunds from './WithdrawFunds';
import TransactionHistory from './TransactionHistory';
import { Wallet, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';

// Mock data fetching
const fetchMentorPayments = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    balance: 15000,
    pendingPayouts: 5000,
    nextPayout: '2024-03-30',
    paymentMethods: [
      {
        id: '1',
        type: 'bkash',
        number: '01712345678',
        isDefault: true
      },
      {
        id: '2',
        type: 'bank',
        accountName: 'John Doe',
        accountNumber: '1234567890',
        bankName: 'Dutch Bangla Bank',
        isDefault: false
      }
    ],
    transactions: [
      {
        id: '1',
        type: 'earning',
        amount: 2000,
        date: '2024-03-20',
        status: 'completed',
        description: 'Session with Sarah Ahmed'
      },
      {
        id: '2',
        type: 'withdrawal',
        amount: 5000,
        date: '2024-03-15',
        status: 'processing',
        description: 'Withdrawal to bKash'
      }
    ]
  };
};

export default function MentorPayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['mentor-payments'],
    queryFn: fetchMentorPayments
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payments</h1>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{payments?.balance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{payments?.pendingPayouts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout Date</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(payments?.nextPayout), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payment-methods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw Funds</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods">
          <PaymentMethods paymentMethods={payments?.paymentMethods} />
        </TabsContent>

        <TabsContent value="withdraw">
          <WithdrawFunds 
            balance={payments?.balance || 0}
            paymentMethods={payments?.paymentMethods}
          />
        </TabsContent>

        <TabsContent value="history">
          <TransactionHistory transactions={payments?.transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}