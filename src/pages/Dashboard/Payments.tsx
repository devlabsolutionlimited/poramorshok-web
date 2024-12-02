import { useState } from 'react';
import { PageLoader } from '@/components/ui/page-loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useStudentPayments } from '@/hooks/api/useStudentPayments';
import RefundDialog from '@/components/payments/RefundDialog';
import TransactionList from '@/components/payments/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';

export default function Payments() {
  const { user } = useAuth();
  const { payments, stats, isLoading, requestRefund } = useStudentPayments();
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    id: string;
    amount: number;
    description: string;
    cancellationReason?: string;
  } | null>(null);

  const handleRefundRequest = (transaction: any) => {
    if (transaction.sessionStatus !== 'cancelled') {
      toast({
        title: 'Refund Not Available',
        description: 'Refunds are only available for cancelled sessions.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedSession({
      id: transaction.sessionId,
      amount: transaction.amount,
      description: transaction.description,
      cancellationReason: transaction.cancellationReason
    });
    setIsWarningModalOpen(true);
  };

  const confirmRefund = async () => {
    if (!selectedSession) return;

    try {
      await requestRefund({
        sessionId: selectedSession.id,
        reason: selectedSession.cancellationReason || 'Session cancelled'
      });
      
      setIsWarningModalOpen(false);
      setSelectedSession(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process refund request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!stats || !payments) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No Payment Data</h2>
        <p className="text-muted-foreground">
          Book your first session to see payment information here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment History</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded Amount</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{stats.refundedAmount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionList
        transactions={payments}
        isStudent={user?.role === 'student'}
        onRefundRequest={handleRefundRequest}
      />

      <RefundDialog
        isOpen={isWarningModalOpen}
        onOpenChange={setIsWarningModalOpen}
        session={selectedSession}
        onConfirm={confirmRefund}
      />
    </div>
  );
}