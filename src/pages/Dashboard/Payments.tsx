import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageLoader } from '@/components/ui/page-loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import RefundDialog from '@/components/payments/RefundDialog';
import TransactionList from '@/components/payments/TransactionList';

// Mock payment data
const fetchPayments = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    transactions: [
      {
        id: '1',
        date: '2024-03-20',
        amount: 2000,
        status: 'completed',
        sessionStatus: 'completed',
        description: 'Session with John Doe',
        type: 'payment',
        sessionId: 'session1'
      },
      {
        id: '2',
        date: '2024-03-15',
        amount: 5000,
        status: 'completed',
        sessionStatus: 'cancelled',
        description: 'Session with Sarah Ahmed',
        type: 'payment',
        sessionId: 'session2',
        cancellationReason: 'Mentor unavailable'
      }
    ]
  };
};

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  sessionStatus: 'completed' | 'cancelled' | 'pending';
  description: string;
  type: string;
  sessionId: string;
  cancellationReason?: string;
}

export default function Payments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    id: string;
    amount: number;
    description: string;
    cancellationReason?: string;
  } | null>(null);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments
  });

  const handleRefundRequest = (transaction: Transaction) => {
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
    try {
      // API call would go here
      console.log('Processing refund for session:', selectedSession);
      
      toast({
        title: 'Refund Request Submitted',
        description: 'Your refund request has been submitted and will be processed within 7 business days.',
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment History</h1>

      <TransactionList
        transactions={payments?.transactions || []}
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