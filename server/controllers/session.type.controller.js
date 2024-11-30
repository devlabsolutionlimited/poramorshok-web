import { SessionTypeService } from '../services/session.type.service.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getSessionTypes = async (req, res, next) => {
  try {
    const sessionTypes = await SessionTypeService.getSessionTypes(req.params.mentorId);
    res.json(sessionTypes);
  } catch (error) {
    logger.error('Get session types error:', error);
    next(error);
  }
};

export const createSessionType = async (req, res, next) => {
  try {
    const sessionType = await SessionTypeService.createSessionType(req.user.id, req.body);
    res.status(201).json(sessionType);
  } catch (error) {
    logger.error('Create session type error:', error);
    next(error);
  }
};

export const updateSessionType = async (req, res, next) => {
  try {
    const sessionType = await SessionTypeService.updateSessionType(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(sessionType);
  } catch (error) {
    logger.error('Update session type error:', error);
    next(error);
  }
};

export const deleteSessionType = async (req, res, next) => {
  try {
    await SessionTypeService.deleteSessionType(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error('Delete session type error:', error);
    next(error);
  }
};