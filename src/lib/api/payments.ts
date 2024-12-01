import api from '@/lib/http';
import type { PaymentMethod, WithdrawalRequest, PaymentStats, Transaction } from '@/types/payment';

// Default empty stats
const emptyStats: PaymentStats = {
  balance: 0,
  pendingPayouts: 0,
  nextPayout: new Date().toISOString(),
  totalEarnings: 0,
  monthlyEarnings: []
};

// Payment Stats
export const getPaymentStats = async (): Promise<PaymentStats> => {
  try {
    const response = await api.get('/mentor/payments/stats');
    // Handle 204 No Content
    if (response.status === 204) {
      return emptyStats;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return emptyStats;
  }
};

// Payment Methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get('/mentor/payments/methods');
    if (response.status === 204) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (data: Partial<PaymentMethod>) => {
  // Transform data to match server expectations
  const paymentData = {
    type: data.type,
    ...(data.type === 'bank' 
      ? {
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          branchName: data.branchName
        }
      : { number: data.number }
    )
  };

  const response = await api.post('/mentor/payments/methods', paymentData);
  return response.data;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>) => {
  const response = await api.put(`/mentor/payments/methods/${id}`, data);
  return response.data;
};

export const deletePaymentMethod = async (id: string) => {
  await api.delete(`/mentor/payments/methods/${id}`);
};

// Withdrawals
export const requestWithdrawal = async (data: WithdrawalRequest) => {
  const response = await api.post('/mentor/payments/withdraw', data);
  return response.data;
};

export const getWithdrawals = async () => {
  try {
    const response = await api.get('/mentor/payments/withdrawals');
    if (response.status === 204) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return [];
  }
};

// Transaction History
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/mentor/payments/transactions');
    if (response.status === 204) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};