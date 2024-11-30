import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  meetingLink: String,
  notes: String,
  feedback: {
    rating: Number,
    review: String,
    createdAt: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);