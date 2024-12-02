import { MentorService } from '../services/mentor.service.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getMentorDashboard = async (req, res, next) => {
  try {
    const stats = await MentorService.getDashboardStats(req.user.id);
    res.json(stats);
  } catch (error) {
    logger.error('Get mentor dashboard error:', error);
    next(error);
  }
};

export const getMentorAnalytics = async (req, res, next) => {
  try {
    const analytics = await MentorService.getAnalytics(req.user.id);
    res.json(analytics);
  } catch (error) {
    logger.error('Get mentor analytics error:', error);
    next(error);
  }
};

export const updateMentorAvailability = async (req, res, next) => {
  try {
    const availability = await MentorService.updateAvailability(req.user.id, req.body);
    res.json(availability);
  } catch (error) {
    logger.error('Update mentor availability error:', error);
    next(error);
  }
};

export const getMentorSessions = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const sessions = await MentorService.getSessions(req.user.id, { status, date });
    res.json(sessions);
  } catch (error) {
    logger.error('Get mentor sessions error:', error);
    next(error);
  }
};

export const createSessionType = async (req, res, next) => {
  try {
    const sessionType = await MentorService.createSessionType(req.user.id, req.body);
    res.status(201).json(sessionType);
  } catch (error) {
    logger.error('Create session type error:', error);
    next(error);
  }
};

export const updateSessionType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionType = await MentorService.updateSessionType(req.user.id, id, req.body);
    res.json(sessionType);
  } catch (error) {
    logger.error('Update session type error:', error);
    next(error);
  }
};

export const deleteSessionType = async (req, res, next) => {
  try {
    const { id } = req.params;
    await MentorService.deleteSessionType(req.user.id, id);
    res.status(204).send();
  } catch (error) {
    logger.error('Delete session type error:', error);
    next(error);
  }
};