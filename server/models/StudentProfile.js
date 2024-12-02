import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  interests: [{
    type: String
  }],
  learningGoals: [{
    type: String
  }],
  preferredLanguages: [{
    type: String
  }],
  education: {
    level: String,
    institution: String,
    field: String,
    graduationYear: Number
  },
  socialLinks: [{
    platform: {
      type: String,
      enum: ['linkedin', 'github', 'twitter', 'website']
    },
    url: String
  }],
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sessionReminders: {
      type: Boolean,
      default: true
    },
    marketingUpdates: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Create student profile when a user with role 'student' is created
studentProfileSchema.statics.createDefaultProfile = async function(userId) {
  const profile = await this.create({
    userId,
    interests: [],
    learningGoals: [],
    preferredLanguages: ['Bengali', 'English']
  });
  return profile;
};

export default mongoose.model('StudentProfile', studentProfileSchema);