import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getProfile,
  updateProfile,
  updateNotificationPreferences
} from '../controllers/student.profile.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);

router.put('/profile',
  [
    body('bio').optional().isString(),
    body('interests').optional().isArray(),
    body('learningGoals').optional().isArray(),
    body('preferredLanguages').optional().isArray(),
    body('education').optional().isObject(),
    body('education.level').optional().isString(),
    body('education.institution').optional().isString(),
    body('education.field').optional().isString(),
    body('education.graduationYear').optional().isInt({ min: 1900, max: new Date().getFullYear() + 10 }),
    body('socialLinks').optional().isArray(),
    body('socialLinks.*.platform').optional().isIn(['linkedin', 'github', 'twitter', 'website']),
    body('socialLinks.*.url').optional().isURL(),
    validate
  ],
  updateProfile
);

router.put('/profile/notifications',
  [
    body('email').isBoolean(),
    body('sessionReminders').isBoolean(),
    body('marketingUpdates').isBoolean(),
    validate
  ],
  updateNotificationPreferences
);

export default router;