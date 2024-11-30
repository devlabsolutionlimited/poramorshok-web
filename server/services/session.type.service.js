import Mentor from '../models/Mentor.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export class SessionTypeService {
  static async getSessionTypes(mentorId) {
    try {
      const mentor = await Mentor.findOne({ userId: mentorId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
      }
      return mentor.sessionTypes || [];
    } catch (error) {
      logger.error('Get session types error:', error);
      throw error;
    }
  }

  static async createSessionType(mentorId, data) {
    try {
      const mentor = await Mentor.findOne({ userId: mentorId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
      }

      // Initialize sessionTypes array if it doesn't exist
      if (!mentor.sessionTypes) {
        mentor.sessionTypes = [];
      }

      // Add new session type
      mentor.sessionTypes.push(data);
      await mentor.save();

      return mentor.sessionTypes[mentor.sessionTypes.length - 1];
    } catch (error) {
      logger.error('Create session type error:', error);
      throw error;
    }
  }

  static async updateSessionType(mentorId, typeId, data) {
    try {
      const mentor = await Mentor.findOne({ userId: mentorId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
      }

      const typeIndex = mentor.sessionTypes.findIndex(
        type => type._id.toString() === typeId
      );

      if (typeIndex === -1) {
        throw new ApiError(404, 'Session type not found');
      }

      // Update session type
      mentor.sessionTypes[typeIndex] = {
        ...mentor.sessionTypes[typeIndex].toObject(),
        ...data
      };

      await mentor.save();
      return mentor.sessionTypes[typeIndex];
    } catch (error) {
      logger.error('Update session type error:', error);
      throw error;
    }
  }

  static async deleteSessionType(mentorId, typeId) {
    try {
      const mentor = await Mentor.findOne({ userId: mentorId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
      }

      const typeIndex = mentor.sessionTypes.findIndex(
        type => type._id.toString() === typeId
      );

      if (typeIndex === -1) {
        throw new ApiError(404, 'Session type not found');
      }

      // Remove session type
      mentor.sessionTypes.splice(typeIndex, 1);
      await mentor.save();
    } catch (error) {
      logger.error('Delete session type error:', error);
      throw error;
    }
  }
}