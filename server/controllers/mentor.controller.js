import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';

export const getMentors = async (req, res, next) => {
  try {
    const { search, expertise, priceRange, rating, language } = req.query;

    let query = { isApproved: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (expertise) {
      query.expertise = { $in: expertise.split(',') };
    }

    if (priceRange) {
      const [min, max] = priceRange.split(',');
      query.hourlyRate = { $gte: min, $lte: max };
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    if (language) {
      query.languages = { $in: language.split(',') };
    }

    const mentors = await Mentor.find(query).populate('userId', 'name email avatar');
    res.json(mentors);
  } catch (error) {
    next(error);
  }
};

export const getMentorById = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate('userId', 'name email avatar');
    if (!mentor) {
      throw new ApiError(404, 'Mentor not found');
    }
    res.json(mentor);
  } catch (error) {
    next(error);
  }
};

export const createMentorProfile = async (req, res, next) => {
  try {
    const existingProfile = await Mentor.findOne({ userId: req.user._id });
    if (existingProfile) {
      throw new ApiError(400, 'Mentor profile already exists');
    }

    const mentor = await Mentor.create({
      userId: req.user._id,
      ...req.body
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'mentor' });

    res.status(201).json(mentor);
  } catch (error) {
    next(error);
  }
};

export const updateMentorProfile = async (req, res, next) => {
  try {
    const mentor = await Mentor.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!mentor) {
      throw new ApiError(404, 'Mentor profile not found');
    }

    res.json(mentor);
  } catch (error) {
    next(error);
  }
};

export const getMentorReviews = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      mentorId: req.params.id,
      'feedback.rating': { $exists: true }
    }).populate('studentId', 'name avatar');

    const reviews = sessions.map(session => ({
      id: session._id,
      rating: session.feedback.rating,
      review: session.feedback.review,
      createdAt: session.feedback.createdAt,
      student: {
        id: session.studentId._id,
        name: session.studentId.name,
        avatar: session.studentId.avatar
      }
    }));

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};