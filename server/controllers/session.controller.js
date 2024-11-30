import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';

export const createSession = async (req, res, next) => {
  try {
    const session = await Session.create({
      ...req.body,
      studentId: req.user._id
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      $or: [
        { studentId: req.params.userId },
        { mentorId: req.params.userId }
      ]
    }).populate('mentorId studentId', 'name avatar');

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentorId studentId', 'name avatar');

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const updateSessionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const addSessionFeedback = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    if (session.studentId.toString() !== req.user._id.toString()) {
      throw new ApiError(403, 'Not authorized to add feedback');
    }

    session.feedback = {
      ...req.body,
      createdAt: new Date()
    };

    await session.save();

    res.json(session);
  } catch (error) {
    next(error);
  }
};