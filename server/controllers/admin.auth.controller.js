import Admin from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { generateToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

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

    // Generate token
    const token = generateToken({ id: admin._id, role: 'admin' });

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

export const getMe = async (req, res) => {
  const admin = await Admin.findById(req.user.id).select('-password');
  res.json(admin);
};