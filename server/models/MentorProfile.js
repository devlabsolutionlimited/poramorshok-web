import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String
  }],
  experience: {
    type: Number,
    default: 0
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
    description: String
  }],
  about: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 0
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
  isApproved: {
    type: Boolean,
    default: false
  },
  customUrl: {
    type: String,
    unique: true,
    sparse: true
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  availableBalance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create mentor profile when a user with role 'mentor' is created
mentorProfileSchema.statics.createDefaultProfile = async function(userId) {
  const profile = await this.create({
    userId,
    hourlyRate: 0,
    expertise: [],
    languages: ['Bengali', 'English'],
    title: 'Mentor',
    about: 'Welcome to my profile! I am here to help you learn and grow.',
    totalEarnings: 0,
    availableBalance: 0
  });
  return profile;
};

// Virtual populate for payment methods
mentorProfileSchema.virtual('paymentMethods', {
  ref: 'PaymentMethod',
  localField: 'userId',
  foreignField: 'userId'
});

const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);
export default MentorProfile;