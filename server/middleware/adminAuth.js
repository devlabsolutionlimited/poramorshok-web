import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import Admin from '../models/Admin.js';
import { logger } from '../utils/logger.js';

export const adminProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized - No token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify this is an admin token
      if (!decoded.isAdmin) {
        throw new ApiError(401, 'Not authorized - Invalid token type');
      }

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        throw new ApiError(401, 'Admin not found');
      }

      if (admin.status !== 'active') {
        throw new ApiError(401, 'Account is inactive');
      }

      req.user = admin;
      next();
    } catch (error) {
      logger.error('Admin auth error:', error);
      throw new ApiError(401, 'Not authorized - Invalid token');
    }
  } catch (error) {
    next(error);
  }
};

export const adminAuthorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};