import Session from '../models/Session.js';
import MentorProfile from '../models/MentorProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getMentorDashboard = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      throw new ApiError(404, 'Mentor profile not found');
    }

    const sessions = await Session.find({ mentorId: req.user._id })
      .populate('studentId', 'name avatar')
      .sort({ date: -1 });

    const stats = {
      totalStudents: new Set(sessions.map(s => s.studentId.toString())).size,
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      upcomingSessions: sessions.filter(s => ['pending', 'confirmed'].includes(s.status)).length,
      totalEarnings: profile.totalEarnings,
      averageRating: profile.rating,
      recentSessions: sessions.slice(0, 5),
      popularTopics: await getPopularTopics(req.user._id)
    };

    res.json(stats);
  } catch (error) {
    logger.error('Get mentor dashboard error:', error);
    next(error);
  }
};

export const getMentorSessions = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    let query = { mentorId: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.date = new Date(date);
    }

    const sessions = await Session.find(query)
      .populate('studentId', 'name avatar')
      .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    logger.error('Get mentor sessions error:', error);
    next(error);
  }
};

export const getSessionStats = async (req, res, next) => {
  try {
    const stats = await Session.aggregate([
      { $match: { mentorId: req.user._id } },
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

const getPopularTopics = async (mentorId) => {
  const topics = await Session.aggregate([
    { $match: { mentorId, status: 'completed' } },
    { $group: {
      _id: '$topic',
      sessions: { $sum: 1 },
      totalRating: { $sum: '$feedback.rating' }
    }},
    { $project: {
      topic: '$_id',
      sessions: 1,
      rating: { $divide: ['$totalRating', '$sessions'] }
    }},
    { $sort: { sessions: -1 } },
    { $limit: 5 }
  ]);

  return topics;
};