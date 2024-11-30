import api from '@/lib/api';
import type { PaymentIntent, PaymentMethod } from '@/types/payment';

export class PaymentService {
  static async createPaymentIntent(amount: number, metadata: any): Promise<PaymentIntent> {
    const response = await api.post('/payments/create-intent', { amount, metadata });
    return response.data;
  }

  static async confirmPayment(paymentIntentId: string, sessionId: string): Promise<void> {
    await api.post('/payments/confirm', { paymentIntentId, sessionId });
  }

  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get('/payments/methods');
    return response.data;
  }

  static async addPaymentMethod(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const response = await api.post('/payments/methods', data);
    return response.data;
  }

  static async removePaymentMethod(id: string): Promise<void> {
    await api.delete(`/payments/methods/${id}`);
  }

  static async getPaymentHistory(): Promise<any[]> {
    const response = await api.get('/payments/history');
    return response.data;
  }

  static async requestRefund(sessionId: string, reason: string): Promise<void> {
    await api.post(`/payments/refund/${sessionId}`, { reason });
  }
}