import { validationResult } from 'express-validator';
import { AuthService } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }

    const { name, email, password, role } = req.body;

    logger.info(`Attempting to register user with email: ${email}`);

    const user = await AuthService.register({
      name,
      email,
      password,
      role
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }

    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    const user = await AuthService.login(email, password);
    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};