import Mentor from '../models/Mentor.js';
import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export class MentorService {
  static async getDashboardStats(mentorId) {
    try {
      const mentor = await Mentor.findOne({ userId: mentorId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      const sessions = await Session.find({ mentorId });
      const completedSessions = sessions.filter(s => s.status === 'completed');
      const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

      const totalEarnings = completedSessions.reduce((sum, session) => {
        return sum + (session.amount || 0);
      }, 0);

      const averageRating = completedSessions.reduce((sum, session) => {
        return sum + (session.feedback?.rating || 0);
      }, 0) / (completedSessions.length || 1);

      return {
        totalStudents: new Set(sessions.map(s => s.studentId)).size,
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        upcomingSessions: upcomingSessions.length,
        totalEarnings,
        averageRating: Number(averageRating.toFixed(1)),
        recentSessions: await this.getRecentSessions(mentorId),
        popularTopics: await this.getPopularTopics(mentorId)
      };
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  static async getAnalytics(mentorId) {
    try {
      const sessions = await Session.find({ mentorId });
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

      const monthlyStats = sessions
        .filter(session => new Date(session.date) >= lastMonth)
        .reduce((acc, session) => {
          const date = new Date(session.date);
          const key = date.toISOString().split('T')[0];
          
          acc[key] = acc[key] || { sessions: 0, earnings: 0 };
          acc[key].sessions++;
          acc[key].earnings += session.amount || 0;
          
          return acc;
        }, {});

      return {
        monthlyStats: Object.entries(monthlyStats).map(([date, stats]) => ({
          date,
          ...stats
        })),
        topicStats: await this.getTopicStats(mentorId),
        completionRate: await this.getCompletionRate(mentorId)
      };
    } catch (error) {
      logger.error('Get analytics error:', error);
      throw error;
    }
  }

  static async updateAvailability(mentorId, availability) {
    try {
      const mentor = await Mentor.findOneAndUpdate(
        { userId: mentorId },
        { availability },
        { new: true }
      );

      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      return mentor.availability;
    } catch (error) {
      logger.error('Update availability error:', error);
      throw error;
    }
  }

  static async getSessions(mentorId, filters = {}) {
    try {
      let query = { mentorId };

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.date) {
        query.date = filters.date;
      }

      const sessions = await Session.find(query)
        .populate('studentId', 'name avatar')
        .sort({ date: -1 });

      return sessions;
    } catch (error) {
      logger.error('Get sessions error:', error);
      throw error;
    }
  }

  static async createSessionType(mentorId, data) {
    try {
      const mentor = await Mentor.findOne({ userId: mentorId });
      if (!mentor) {
        throw new ApiError(404, 'Mentor profile not found');
      }

      mentor.sessionTypes = mentor.sessionTypes || [];
      mentor.sessionTypes.push({
        ...data,
        id: new mongoose.Types.ObjectId()
      });

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
        throw new ApiError(404, 'Mentor profile not found');
      }

      const typeIndex = mentor.sessionTypes.findIndex(t => t.id.toString() === typeId);
      if (typeIndex === -1) {
        throw new ApiError(404, 'Session type not found');
      }

      mentor.sessionTypes[typeIndex] = {
        ...mentor.sessionTypes[typeIndex],
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
        throw new ApiError(404, 'Mentor profile not found');
      }

      mentor.sessionTypes = mentor.sessionTypes.filter(
        t => t.id.toString() !== typeId
      );

      await mentor.save();
    } catch (error) {
      logger.error('Delete session type error:', error);
      throw error;
    }
  }

  // Helper methods
  static async getRecentSessions(mentorId) {
    return Session.find({ mentorId })
      .populate('studentId', 'name avatar')
      .sort({ date: -1 })
      .limit(5);
  }

  static async getPopularTopics(mentorId) {
    const sessions = await Session.find({ mentorId, status: 'completed' });
    const topicCounts = sessions.reduce((acc, session) => {
      acc[session.topic] = (acc[session.topic] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  static async getTopicStats(mentorId) {
    const sessions = await Session.find({ mentorId, status: 'completed' });
    return sessions.reduce((acc, session) => {
      if (!acc[session.topic]) {
        acc[session.topic] = {
          totalSessions: 0,
          totalRating: 0,
          averageRating: 0
        };
      }

      acc[session.topic].totalSessions++;
      if (session.feedback?.rating) {
        acc[session.topic].totalRating += session.feedback.rating;
        acc[session.topic].averageRating = 
          acc[session.topic].totalRating / acc[session.topic].totalSessions;
      }

      return acc;
    }, {});
  }

  static async getCompletionRate(mentorId) {
    const sessions = await Session.find({ mentorId });
    const completed = sessions.filter(s => s.status === 'completed').length;
    return sessions.length ? (completed / sessions.length) * 100 : 0;
  }
}