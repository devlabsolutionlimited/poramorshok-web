export interface PaymentStats {
  balance: number;
  pendingPayouts: number;
  nextPayout: string;
  totalEarnings: number;
  monthlyEarnings: Array<{
    month: string;
    amount: number;
  }>;
}

export interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal';
  amount: number;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  type: 'bkash' | 'nagad' | 'bank';
  number?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  isDefault: boolean;
}

export interface WithdrawalRequest {
  amount: number;
  paymentMethodId: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: PaymentMethod;
  createdAt: string;
  processedAt?: string;
  transactionId?: string;
}

export interface Earning {
  id: string;
  sessionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  platformFee: number;
  netAmount: number;
  createdAt: string;
}