import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join('uploads/avatars', path.basename(user.avatar));
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