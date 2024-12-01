import api from '@/lib/http';
import type { PaymentMethod, PaymentStats, Transaction, WithdrawalRequest } from '@/types/payment';

// Payment Stats
export const getPaymentStats = async (): Promise<PaymentStats> => {
  try {
    const response = await api.get('/mentor/payments/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return {
      balance: 0,
      pendingPayouts: 0,
      nextPayout: new Date().toISOString(),
      totalEarnings: 0,
      monthlyEarnings: []
    };
  }
};

// Payment Methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get('/mentor/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
};

export const addPaymentMethod = async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const formattedData = {
    ...data,
    number: data.type !== 'bank' ? data.number?.replace(/\s+/g, '') : undefined,
  };

  const response = await api.post('/mentor/payment-methods', formattedData);
  return response.data;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const response = await api.put(`/mentor/payment-methods/${id}`, data);
  return response.data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  await api.delete(`/mentor/payment-methods/${id}`);
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/mentor/payments/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// Withdrawals
export const requestWithdrawal = async (data: WithdrawalRequest): Promise<void> => {
  const response = await api.post('/mentor/payments/withdraw', data);
  return response.data;
};

export const getWithdrawals = async () => {
  try {
    const response = await api.get('/mentor/payments/withdrawals');
    return response.data;
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return [];
  }
};