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
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  meetingLink: String,
  notes: String,
  recordingUrl: String,
  joinedAt: Date,
  leftAt: Date,
  mentorJoinedAt: Date,
  mentorLeftAt: Date,
  cancellationReason: String,
  cancellationTime: Date,
  cancellationBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  feedback: {
    rating: Number,
    review: String,
    createdAt: Date
  },
  verificationCode: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  screenshots: [{
    url: String,
    timestamp: Date
  }],
  activityLog: [{
    action: {
      type: String,
      enum: ['join', 'leave', 'screen_share', 'chat', 'verification']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date,
    metadata: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

export default mongoose.model('Session', sessionSchema);