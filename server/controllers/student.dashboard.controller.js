import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getStudentDashboard = async (req, res, next) => {
  try {
    // Get all sessions for the student
    const sessions = await Session.find({ studentId: req.user._id })
      .populate('mentorId', 'name avatar expertise')
      .sort({ date: -1 });

    // Calculate stats
    const stats = {
      totalSessions: sessions.length,
      hoursLearned: sessions.reduce((sum, session) => sum + session.duration / 60, 0),
      totalSpent: sessions.reduce((sum, session) => sum + (session.amount || 0), 0),
      averageRating: calculateAverageRating(sessions),
      upcomingSessions: getUpcomingSessions(sessions),
      learningProgress: await calculateLearningProgress(req.user._id),
      recentMentors: await getRecentMentors(req.user._id)
    };

    res.json(stats);
  } catch (error) {
    logger.error('Get student dashboard error:', error);
    next(error);
  }
};

const calculateAverageRating = (sessions) => {
  const sessionsWithFeedback = sessions.filter(s => s.feedback?.rating);
  if (sessionsWithFeedback.length === 0) return 0;
  
  const totalRating = sessionsWithFeedback.reduce((sum, s) => sum + s.feedback.rating, 0);
  return Number((totalRating / sessionsWithFeedback.length).toFixed(1));
};

const getUpcomingSessions = (sessions) => {
  const now = new Date();
  return sessions
    .filter(session => 
      ['pending', 'confirmed'].includes(session.status) && 
      new Date(session.date) >= now
    )
    .map(session => ({
      id: session._id,
      mentorName: session.mentorId.name,
      topic: session.topic,
      date: session.date,
      time: session.startTime,
      duration: session.duration,
      meetingLink: session.meetingLink
    }))
    .slice(0, 5);
};

const calculateLearningProgress = async (studentId) => {
  const topics = await Session.aggregate([
    { 
      $match: { 
        studentId,
        status: { $in: ['completed', 'confirmed'] }
      }
    },
    {
      $group: {
        _id: '$topic',
        sessionsCompleted: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalSessions: { $sum: 1 }
      }
    },
    {
      $project: {
        topic: '$_id',
        sessionsCompleted: 1,
        totalSessions: 1,
        progress: {
          $multiply: [
            { $divide: ['$sessionsCompleted', '$totalSessions'] },
            100
          ]
        }
      }
    },
    { $sort: { totalSessions: -1 } },
    { $limit: 5 }
  ]);

  return topics;
};

const getRecentMentors = async (studentId) => {
  const recentSessions = await Session.aggregate([
    { $match: { studentId } },
    { $sort: { date: -1 } },
    {
      $group: {
        _id: '$mentorId',
        lastSession: { $first: '$$ROOT' },
        totalSessions: { $sum: 1 },
        averageRating: { $avg: '$feedback.rating' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'mentor'
      }
    },
    { $unwind: '$mentor' },
    {
      $lookup: {
        from: 'mentorprofiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'mentorProfile'
      }
    },
    { $unwind: '$mentorProfile' },
    {
      $project: {
        id: '$_id',
        name: '$mentor.name',
        avatar: '$mentor.avatar',
        expertise: '$mentorProfile.expertise',
        rating: { $round: ['$averageRating', 1] }
      }
    },
    { $limit: 5 }
  ]);

  return recentSessions;
};