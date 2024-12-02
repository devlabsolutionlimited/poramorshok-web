import Admin from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (admin.status !== 'active') {
      throw new ApiError(401, 'Your account is inactive');
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token with admin flag
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      },
      token
    });
  } catch (error) {
    logger.error('Admin login error:', error);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');
    if (!admin) {
      throw new ApiError(404, 'Admin not found');
    }
    res.json(admin);
  } catch (error) {
    logger.error('Get admin profile error:', error);
    next(error);
  }
};