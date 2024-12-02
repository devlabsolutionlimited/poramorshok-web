import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nagad', 'bank', 'card'],
    required: true
  },
  description: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Create indexes
transactionSchema.index({ mentorId: 1, createdAt: -1 });
transactionSchema.index({ studentId: 1, createdAt: -1 });
transactionSchema.index({ sessionId: 1 });
transactionSchema.index({ status: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
