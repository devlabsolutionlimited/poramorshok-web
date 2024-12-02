import StudentProfile from '../models/StudentProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      throw new ApiError(404, 'Student profile not found');
    }
    res.json(profile);
  } catch (error) {
    logger.error('Get student profile error:', error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'bio', 'interests', 'learningGoals', 'preferredLanguages',
      'education', 'socialLinks', 'notificationPreferences'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(404, 'Student profile not found');
    }

    res.json(profile);
  } catch (error) {
    logger.error('Update student profile error:', error);
    next(error);
  }
};

export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { notificationPreferences: req.body },
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(404, 'Student profile not found');
    }

    res.json(profile.notificationPreferences);
  } catch (error) {
    logger.error('Update notification preferences error:', error);
    next(error);
  }
};