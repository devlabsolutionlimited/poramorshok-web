import api from '@/lib/http';
import type { PaymentMethod, WithdrawalRequest } from '@/types/payment';

export const getPaymentMethods = async () => {
  const response = await api.get('/api/mentor/payments/methods');
  return response.data;
};

export const addPaymentMethod = async (data: Partial<PaymentMethod>) => {
  const response = await api.post('/api/mentor/payments/methods', data);
  return response.data;
};

export const updatePaymentMethod = async (id: string, data: Partial<PaymentMethod>) => {
  const response = await api.put(`/api/mentor/payments/methods/${id}`, data);
  return response.data;
};

export const deletePaymentMethod = async (id: string) => {
  await api.delete(`/api/mentor/payments/methods/${id}`);
};

export const requestWithdrawal = async (data: WithdrawalRequest) => {
  const response = await api.post('/api/mentor/payments/withdraw', data);
  return response.data;
};

export const getWithdrawals = async () => {
  const response = await api.get('/api/mentor/payments/withdrawals');
  return response.data;
};

export const getEarnings = async () => {
  const response = await api.get('/api/mentor/payments/earnings');
  return response.data;
};

export const getEarningStats = async () => {
  const response = await api.get('/api/mentor/payments/earnings/stats');
  return response.data;
};