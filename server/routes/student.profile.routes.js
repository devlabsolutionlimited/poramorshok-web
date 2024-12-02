import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../config/multer.js';
import {
  getProfile,
  updateProfile,
  updateAvatar
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
    validate
  ],
  updateProfile
);

router.put('/profile/avatar',
  upload.single('avatar'),
  updateAvatar
);

export default router;