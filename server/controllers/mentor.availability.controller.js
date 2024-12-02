import Availability from '../models/Availability.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({ mentorId: req.user._id });
    
    if (!availability) {
      // Create default availability if none exists
      availability = await Availability.create({
        mentorId: req.user._id
      });
    }

    res.json(availability);
  } catch (error) {
    logger.error('Get availability error:', error);
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const {
      monday, tuesday, wednesday, thursday, friday, saturday, sunday,
      startTime, endTime, sessionDuration, breakBetweenSessions
    } = req.body;

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (startTime && !timeRegex.test(startTime)) {
      throw new ApiError(400, 'Invalid start time format');
    }
    if (endTime && !timeRegex.test(endTime)) {
      throw new ApiError(400, 'Invalid end time format');
    }

    const availability = await Availability.findOneAndUpdate(
      { mentorId: req.user._id },
      {
        monday, tuesday, wednesday, thursday, friday, saturday, sunday,
        startTime, endTime, sessionDuration, breakBetweenSessions
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(availability);
  } catch (error) {
    logger.error('Update availability error:', error);
    next(error);
  }
};