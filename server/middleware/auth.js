import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';
import MentorProfile from '../models/MentorProfile.js';
import { logger } from '../utils/logger.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized - No token provided');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      if (user.status !== 'active') {
        throw new ApiError(401, 'Account is not active');
      }

      // If user is a mentor, ensure they have a profile
      if (user.role === 'mentor') {
        const mentorProfile = await MentorProfile.findOne({ userId: user._id });
        if (!mentorProfile) {
          // Create default profile if it doesn't exist
          await MentorProfile.createDefaultProfile(user._id);
        }
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error('Auth middleware error:', error);
      throw new ApiError(401, 'Not authorized - Invalid token');
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};