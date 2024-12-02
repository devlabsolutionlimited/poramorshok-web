import MentorProfile from '../models/MentorProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const ensureMentorProfile = async (req, res, next) => {
  try {
    let profile = await MentorProfile.findOne({ userId: req.user._id });
    
    if (!profile && req.user.role === 'mentor') {
      // Create default profile if it doesn't exist
      try {
        profile = await MentorProfile.createDefaultProfile(req.user._id);
        logger.info(`Created default mentor profile for user ${req.user._id}`);
      } catch (error) {
        logger.error('Failed to create default mentor profile:', error);
        throw new ApiError(500, 'Failed to create mentor profile');
      }
    }

    if (!profile) {
      throw new ApiError(404, 'Mentor profile not found');
    }

    req.mentorProfile = profile;
    next();
  } catch (error) {
    next(error);
  }
};