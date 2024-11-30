import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';
import {
  getMentorDashboard,
  getMentorAnalytics,
  updateMentorAvailability,
  getMentorSessions,
  createSessionType,
  updateSessionType,
  deleteSessionType
} from '../controllers/mentor.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('mentor'));

// Dashboard routes
router.get('/dashboard', getMentorDashboard);
router.get('/analytics', getMentorAnalytics);

// Session management routes
router.get('/sessions', getMentorSessions);

// Availability routes
router.put(
  '/availability',
  [
    body('days').isArray(),
    body('timeSlots').isArray(),
    validate
  ],
  updateMentorAvailability
);

// Session types routes
router.post(
  '/session-types',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
    body('price').isInt({ min: 0 }).withMessage('Price must be a positive number'),
    validate
  ],
  createSessionType
);

router.put(
  '/session-types/:id',
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('duration').optional().isInt({ min: 15 }),
    body('price').optional().isInt({ min: 0 }),
    validate
  ],
  updateSessionType
);

router.delete('/session-types/:id', deleteSessionType);

export default router;