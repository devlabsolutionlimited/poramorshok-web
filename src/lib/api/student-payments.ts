import api from '@/lib/http';

export interface PaymentStats {
  totalSpent: number;
  totalSessions: number;
  refundedAmount: number;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
}

export interface Payment {
  id: string;
  sessionId: {
    topic: string;
    date: string;
    startTime: string;
    duration: number;
  };
  amount: number;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
}

export const getPaymentHistory = async (): Promise<Payment[]> => {
  const response = await api.get('/api/student/payments/history');
  return response.data;
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await api.get('/api/student/payments/stats');
  return response.data;
};

export const requestRefund = async (data: {
  sessionId: string;
  reason: string;
}): Promise<Payment> => {
  const response = await api.post('/api/student/payments/refund', data);
  return response.data;
};