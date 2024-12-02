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
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monday: {
    type: Boolean,
    default: true
  },
  tuesday: {
    type: Boolean,
    default: true
  },
  wednesday: {
    type: Boolean,
    default: true
  },
  thursday: {
    type: Boolean,
    default: true
  },
  friday: {
    type: Boolean,
    default: true
  },
  saturday: {
    type: Boolean,
    default: false
  },
  sunday: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: '09:00'
  },
  endTime: {
    type: String,
    default: '17:00'
  },
  sessionDuration: {
    type: Number,
    default: 60,
    min: 30,
    max: 120
  },
  breakBetweenSessions: {
    type: Number,
    default: 15,
    min: 0,
    max: 60
  }
}, {
  timestamps: true
});

export default mongoose.model('Availability', availabilitySchema);