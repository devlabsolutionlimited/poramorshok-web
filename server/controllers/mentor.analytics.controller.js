import Session from '../models/Session.js';
import MentorProfile from '../models/MentorProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getMentorAnalytics = async (req, res, next) => {
  try {
    const mentorId = req.user._id;

    // Get all completed sessions
    const sessions = await Session.find({
      mentorId,
      status: 'completed'
    }).sort({ date: -1 });

    // Calculate total earnings
    const totalEarnings = sessions.reduce((sum, session) => sum + session.amount, 0);

    // Calculate average rating
    const sessionsWithRating = sessions.filter(s => s.feedback?.rating);
    const averageRating = sessionsWithRating.length > 0
      ? sessionsWithRating.reduce((sum, s) => sum + s.feedback.rating, 0) / sessionsWithRating.length
      : 0;

    // Calculate completion rate
    const allSessions = await Session.find({ mentorId });
    const completionRate = allSessions.length > 0
      ? (sessions.length / allSessions.length) * 100
      : 0;

    // Get sessions by day for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const sessionsByDay = await Promise.all(
      last7Days.map(async (date) => {
        const count = await Session.countDocuments({
          mentorId,
          date: {
            $gte: new Date(date),
            $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          }
        });
        return { date, sessions: count };
      })
    );

    // Get top topics
    const topTopics = await Session.aggregate([
      { $match: { mentorId, status: 'completed' } },
      { $group: {
        _id: '$topic',
        sessions: { $sum: 1 },
        avgRating: { $avg: '$feedback.rating' }
      }},
      { $sort: { sessions: -1 } },
      { $limit: 5 },
      { $project: {
        topic: '$_id',
        sessions: 1,
        rating: { $round: ['$avgRating', 1] }
      }}
    ]);

    res.json({
      totalEarnings,
      totalSessions: sessions.length,
      averageRating: Number(averageRating.toFixed(1)),
      completionRate: Number(completionRate.toFixed(1)),
      sessionsByDay,
      topTopics
    });

  } catch (error) {
    logger.error('Get mentor analytics error:', error);
    next(error);
  }
};

export const getSessionStats = async (req, res, next) => {
  try {
    const mentorId = req.user._id;

    const stats = await Session.aggregate([
      { $match: { mentorId } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const formattedStats = {
      upcoming: 0,
      completed: 0,
      cancelled: 0,
      pending: 0
    };

    stats.forEach(({ _id, count }) => {
      formattedStats[_id] = count;
    });

    res.json(formattedStats);

  } catch (error) {
    logger.error('Get session stats error:', error);
    next(error);
  }
};

export const getEarningsStats = async (req, res, next) => {
  try {
    const mentorId = req.user._id;

    const profile = await MentorProfile.findOne({ userId: mentorId });
    if (!profile) {
      throw new ApiError(404, 'Mentor profile not found');
    }

    // Get monthly earnings for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEarnings = await Session.aggregate([
      {
        $match: {
          mentorId,
          status: 'completed',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          earnings: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      totalEarnings: profile.totalEarnings,
      availableBalance: profile.availableBalance,
      monthlyEarnings: monthlyEarnings.map(({ _id, earnings }) => ({
        month: `${_id.year}-${String(_id.month).padStart(2, '0')}`,
        amount: earnings
      }))
    });

  } catch (error) {
    logger.error('Get earnings stats error:', error);
    next(error);
  }
};