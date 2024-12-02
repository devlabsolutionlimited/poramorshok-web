import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ensureMentorProfile } from '../middleware/ensureMentorProfile.js';
import {
  getAvailability,
  updateAvailability
} from '../controllers/mentor.availability.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('mentor'));
router.use(ensureMentorProfile);

router.get('/', getAvailability);

router.put('/',
  [
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
    body('sessionDuration').isInt({ min: 30, max: 120 }).withMessage('Session duration must be between 30 and 120 minutes'),
    body('breakBetweenSessions').isInt({ min: 0, max: 60 }).withMessage('Break duration must be between 0 and 60 minutes'),
    validate
  ],
  updateAvailability
);

export default router;