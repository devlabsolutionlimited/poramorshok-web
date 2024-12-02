import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

export const getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      profile = await StudentProfile.createDefaultProfile(req.user._id);
    }

    res.json(profile);
  } catch (error) {
    logger.error('Get student profile error:', error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }

    res.json(profile);
  } catch (error) {
    logger.error('Update student profile error:', error);
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar.replace(/^\//, ''));
      try {
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        logger.error('Error deleting old avatar:', error);
      }
    }

    // Update user avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.json({ 
      message: 'Avatar updated successfully',
      avatar: avatarUrl
    });
  } catch (error) {
    logger.error('Update avatar error:', error);
    next(error);
  }
};