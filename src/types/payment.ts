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

export interface EarningStats {
  totalEarnings: number;
  pendingAmount: number;
  availableBalance: number;
  monthlyEarnings: Array<{
    month: string;
    amount: number;
  }>;
}