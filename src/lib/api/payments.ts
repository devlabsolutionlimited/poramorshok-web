import api from '@/lib/http';
import type { PaymentMethod, PaymentStats, Transaction, WithdrawalRequest } from '@/types/payment';

// Payment Stats
export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await api.get('/mentor/payments/stats');
  return response.data;
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

export const addPaymentMethod = async (data: Partial<PaymentMethod>) => {
  const formattedData = {
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

  const response = await api.post('/mentor/payment-methods', formattedData);
  return response.data;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>) => {
  const response = await api.put(`/mentor/payment-methods/${id}`, data);
  return response.data;
};

export const deletePaymentMethod = async (id: string) => {
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
export const requestWithdrawal = async (data: WithdrawalRequest) => {
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