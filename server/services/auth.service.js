import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  static async register(userData) {
    try {
      const userExists = await User.findOne({ email: userData.email });
      if (userExists) {
        throw new ApiError(400, 'User already exists');
      }

      const user = await User.create(userData);
      const token = this.generateToken(user._id);

      logger.info(`New user registered: ${user.email}`);
      return { user, token };
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

      const token = this.generateToken(user._id);
      logger.info(`User logged in: ${user.email}`);
      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, 'Invalid token');
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