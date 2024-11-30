import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  company: String,
  expertise: [{
    type: String
  }],
  experience: Number,
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  about: String,
  hourlyRate: {
    type: Number,
    required: true
  },
  languages: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  availability: [{
    day: String,
    slots: [{
      startTime: String,
      endTime: String
    }]
  }],
  isApproved: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Mentor', mentorSchema);