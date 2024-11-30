import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export class MentorProfileService {
  static async getProfile(userId) {
    try {
      const mentor = await Mentor.findOne({ userId }).populate('userId', 'name email avatar');
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }
      return mentor;
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }

  static async updateBasicInfo(userId, data) {
    try {
      const mentor = await Mentor.findOne({ userId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      // Update user name if provided
      if (data.name) {
        await User.findByIdAndUpdate(userId, { name: data.name });
      }

      // Update mentor profile
      Object.assign(mentor, {
        title: data.title,
        company: data.company,
        about: data.about,
        hourlyRate: data.hourlyRate
      });

      await mentor.save();
      return mentor;
    } catch (error) {
      logger.error('Update basic info error:', error);
      throw error;
    }
  }

  static async updateExpertise(userId, data) {
    try {
      const mentor = await Mentor.findOne({ userId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      mentor.expertise = data.expertise;
      mentor.languages = data.languages;

      await mentor.save();
      return mentor;
    } catch (error) {
      logger.error('Update expertise error:', error);
      throw error;
    }
  }

  static async updateEducation(userId, data) {
    try {
      const mentor = await Mentor.findOne({ userId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      mentor.education = data.education;

      await mentor.save();
      return mentor;
    } catch (error) {
      logger.error('Update education error:', error);
      throw error;
    }
  }

  static async updateSocialLinks(userId, data) {
    try {
      const mentor = await Mentor.findOne({ userId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      mentor.socialLinks = data.socialLinks;

      await mentor.save();
      return mentor;
    } catch (error) {
      logger.error('Update social links error:', error);
      throw error;
    }
  }

  static async updateCustomUrl(userId, customUrl) {
    try {
      // Check if custom URL is already taken
      const existingMentor = await Mentor.findOne({ customUrl });
      if (existingMentor && existingMentor.userId.toString() !== userId) {
        throw new ApiError(400, 'Custom URL is already taken');
      }

      const mentor = await Mentor.findOne({ userId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      mentor.customUrl = customUrl;
      await mentor.save();
      return mentor;
    } catch (error) {
      logger.error('Update custom URL error:', error);
      throw error;
    }
  }

  static async updateAvatar(userId, file) {
    try {
      // In a real implementation, you would:
      // 1. Upload the file to a cloud storage (e.g., AWS S3)
      // 2. Get the URL of the uploaded file
      // 3. Update the user's avatar field
      // For now, we'll just update with a placeholder URL
      
      const avatarUrl = `https://example.com/avatars/${userId}`;
      
      await User.findByIdAndUpdate(userId, { avatar: avatarUrl });
      
      return avatarUrl;
    } catch (error) {
      logger.error('Update avatar error:', error);
      throw error;
    }
  }
}