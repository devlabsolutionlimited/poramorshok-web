import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  static async register({ name, email, password, role }) {
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new ApiError(400, 'User already exists');
      }

      const user = await User.create({
        name,
        email,
        password,
        role
      });

      logger.info(`New user registered: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError(401, 'Invalid credentials');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
      }

      logger.info(`User logged in: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async validateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}