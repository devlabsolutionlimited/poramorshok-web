import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
    year: Number,
    description: String
  }],
  about: String,
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
  }
}, {
  timestamps: true
});

// Create mentor profile when a user with role 'mentor' is created
mentorProfileSchema.statics.createDefaultProfile = async function(userId) {
  const profile = await this.create({
    userId,
    hourlyRate: 0,
    expertise: [],
    languages: ['Bengali', 'English']
  });
  return profile;
};

const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);
export default MentorProfile;