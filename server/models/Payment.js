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
  number: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.type === 'bank') return true;
        return /^01[3-9]\d{8}$/.test(v);
      },
      message: 'Invalid mobile number format'
    }
  },
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

// Ensure required fields based on type
paymentMethodSchema.pre('save', function(next) {
  if (this.type === 'bank') {
    if (!this.accountName || !this.accountNumber || !this.bankName || !this.branchName) {
      next(new Error('Bank account details are required'));
    }
  } else if (!this.number) {
    next(new Error('Mobile number is required for mobile banking methods'));
  }
  next();
});

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
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