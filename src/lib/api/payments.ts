import http from '@/lib/http';
import type { PaymentMethod, PaymentStats, Transaction, WithdrawalRequest } from '@/types/payment';

// Payment Stats
export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await http.get('/mentor/payments/stats');
  return response.data;
};

// Payment Methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await http.get('/mentor/payments/methods');
  return response.data;
};

export const addPaymentMethod = async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  // Format mobile numbers by removing spaces
  const formattedData = {
    ...data,
    number: data.type !== 'bank' ? data.number?.replace(/\s+/g, '') : undefined,
  };

  const response = await http.post('/mentor/payments/methods', formattedData);
  return response.data;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
  const response = await http.put(`/mentor/payments/methods/${id}`, data);
  return response.data;
};

export const deletePaymentMethod = async (id: string): Promise<void> => {
  await http.delete(`/mentor/payments/methods/${id}`);
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await http.get('/mentor/payments/transactions');
  return response.data;
};

// Withdrawals
export const requestWithdrawal = async (data: WithdrawalRequest): Promise<void> => {
  const response = await http.post('/mentor/payments/withdraw', data);
  return response.data;
};

export const getWithdrawals = async () => {
  const response = await http.get('/mentor/payments/withdrawals');
  return response.data;
};