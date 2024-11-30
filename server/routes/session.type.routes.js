import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getSessionTypes,
  createSessionType,
  updateSessionType,
  deleteSessionType
} from '../controllers/session.type.controller.js';

const router = express.Router();

// Public routes
router.get('/:mentorId', getSessionTypes);

// Protected routes
router.use(protect);
router.use(authorize('mentor'));

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
    body('price').isInt({ min: 0 }).withMessage('Price must be a positive number'),
    body('type').isIn(['one-on-one', 'group']).withMessage('Invalid session type'),
    body('maxParticipants').optional().isInt({ min: 1 }),
    body('topics').isArray().withMessage('Topics must be an array'),
    validate
  ],
  createSessionType
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('duration').optional().isInt({ min: 15 }),
    body('price').optional().isInt({ min: 0 }),
    body('type').optional().isIn(['one-on-one', 'group']),
    body('maxParticipants').optional().isInt({ min: 1 }),
    body('topics').optional().isArray(),
    validate
  ],
  updateSessionType
);

router.delete('/:id', deleteSessionType);

export default router;