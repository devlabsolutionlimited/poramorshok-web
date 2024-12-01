import api from '@/lib/http';
import type { PaymentStats, PaymentMethod, Transaction, WithdrawalRequest } from '@/types/payment';

// Payment Stats
export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await api.get('/mentor/payments/stats');
  return response.data;
};

// Payment Methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await api.get('/mentor/payment-methods');
  return response.data;
};

export const addPaymentMethod = async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const formattedData = {
    ...data,
    // Format mobile number for mobile banking methods
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
  const response = await api.get('/mentor/payments/transactions');
  return response.data;
};

// Withdrawals
export const requestWithdrawal = async (data: WithdrawalRequest): Promise<void> => {
  const response = await api.post('/mentor/payments/withdraw', data);
  return response.data;
};

export const getWithdrawals = async () => {
  const response = await api.get('/mentor/payments/withdrawals');
  return response.data;
};