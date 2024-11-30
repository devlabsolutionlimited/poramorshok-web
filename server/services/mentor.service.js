import Mentor from '../models/Mentor.js';
import { ApiError } from '../utils/ApiError.js';

export class MentorService {
  static async search(filters) {
    const query = { isApproved: true };

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { company: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.expertise) {
      query.expertise = { $in: filters.expertise };
    }

    if (filters.priceRange) {
      query.hourlyRate = { 
        $gte: filters.priceRange.min, 
        $lte: filters.priceRange.max 
      };
    }

    return Mentor.find(query).populate('userId', 'name email avatar');
  }

  static async getById(id) {
    const mentor = await Mentor.findById(id).populate('userId', 'name email avatar');
    if (!mentor) {
      throw new ApiError(404, 'Mentor not found');
    }
    return mentor;
  }

  static async createProfile(userId, data) {
    const existingProfile = await Mentor.findOne({ userId });
    if (existingProfile) {
      throw new ApiError(400, 'Mentor profile already exists');
    }

    return Mentor.create({ userId, ...data });
  }

  static async updateProfile(userId, data) {
    const mentor = await Mentor.findOneAndUpdate(
      { userId },
      data,
      { new: true }
    );

    if (!mentor) {
      throw new ApiError(404, 'Mentor profile not found');
    }

    return mentor;
  }
}