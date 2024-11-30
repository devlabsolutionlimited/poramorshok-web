import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { generateVerificationCode } from '../utils/session.js';
import { logger } from '../utils/logger.js';

export class SessionService {
  static async create(data) {
    try {
      const session = await Session.create({
        ...data,
        verificationCode: generateVerificationCode()
      });
      logger.info(`New session created: ${session._id}`);
      return session;
    } catch (error) {
      logger.error('Session creation error:', error);
      throw error;
    }
  }

  static async getUserSessions(userId) {
    try {
      return Session.find({
        $or: [
          { studentId: userId },
          { mentorId: userId }
        ]
      }).populate('mentorId studentId', 'name avatar');
    } catch (error) {
      logger.error('Get user sessions error:', error);
      throw error;
    }
  }

  static async getById(id) {
    const session = await Session.findById(id)
      .populate('mentorId studentId', 'name avatar');

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    return session;
  }

  static async updateStatus(id, status, userId) {
    try {
      const session = await this.getById(id);

      if (session.mentorId.toString() !== userId && 
          session.studentId.toString() !== userId) {
        throw new ApiError(403, 'Not authorized to update this session');
      }

      session.status = status;
      await session.save();
      
      logger.info(`Session ${id} status updated to ${status}`);
      return session;
    } catch (error) {
      logger.error('Update session status error:', error);
      throw error;
    }
  }

  static async addFeedback(id, feedback, userId) {
    try {
      const session = await this.getById(id);

      if (session.studentId.toString() !== userId) {
        throw new ApiError(403, 'Not authorized to add feedback');
      }

      session.feedback = {
        ...feedback,
        createdAt: new Date()
      };

      await session.save();
      logger.info(`Feedback added to session ${id}`);
      return session;
    } catch (error) {
      logger.error('Add feedback error:', error);
      throw error;
    }
  }

  static async verifySession(id, verificationCode, userId) {
    try {
      const session = await this.getById(id);

      if (verificationCode !== session.verificationCode) {
        throw new ApiError(400, 'Invalid verification code');
      }

      session.isVerified = true;
      session.status = 'completed';
      
      session.activityLog.push({
        action: 'verification',
        userId,
        timestamp: new Date()
      });

      await session.save();
      logger.info(`Session ${id} verified successfully`);
      return session;
    } catch (error) {
      logger.error('Session verification error:', error);
      throw error;
    }
  }
}