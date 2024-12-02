import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const availabilitySchema = new mongoose.Schema({
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  timeSlots: [timeSlotSchema],
  timezone: {
    type: String,
    default: 'Asia/Dhaka'
  }
});

const sessionTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['one-on-one', 'group'],
    default: 'one-on-one'
  },
  maxParticipants: {
    type: Number,
    default: 1
  },
  topics: [{
    type: String
  }]
});

const mentorSchema = new mongoose.Schema({
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
  availability: availabilitySchema,
  sessionTypes: [sessionTypeSchema],
  isApproved: {
    type: Boolean,
    default: false
  },
  customUrl: {
    type: String,
    unique: true,
    sparse: true
  },
  socialLinks: [{
    platform: {
      type: String,
      enum: ['twitter', 'linkedin', 'github', 'website']
    },
    url: String
  }],
  achievements: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for searching
mentorSchema.index({
  title: 'text',
  company: 'text',
  expertise: 'text'
});

// Calculate rating when feedback is added
mentorSchema.methods.updateRating = async function(rating) {
  this.totalReviews += 1;
  this.rating = ((this.rating * (this.totalReviews - 1)) + rating) / this.totalReviews;
  await this.save();
};

// Virtual for total earnings
mentorSchema.virtual('totalEarnings', {
  ref: 'Earning',
  localField: 'userId',
  foreignField: 'userId',
  match: { status: 'completed' },
  get: function(earnings) {
    return earnings?.reduce((sum, earning) => sum + earning.netAmount, 0) || 0;
  }
});

// Virtual for total sessions
mentorSchema.virtual('totalSessions', {
  ref: 'Session',
  localField: 'userId',
  foreignField: 'mentorId',
  count: true
});

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;