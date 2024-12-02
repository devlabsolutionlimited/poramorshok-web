import mongoose from 'mongoose';

const studentPaymentSchema = new mongoose.Schema({
  studentId: {
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
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nagad', 'card'],
    required: true
  },
  transactionId: String,
  refundReason: String,
  refundedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('StudentPayment', studentPaymentSchema);