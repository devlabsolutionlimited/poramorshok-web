import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bkash', 'nagad', 'bank'],
    required: true
  },
  // For mobile banking
  number: String,
  // For bank accounts
  accountName: String,
  accountNumber: String,
  bankName: String,
  branchName: String,
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionId: String,
  processedAt: Date,
  notes: String
}, {
  timestamps: true
});

const earningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export const Earning = mongoose.model('Earning', earningSchema);