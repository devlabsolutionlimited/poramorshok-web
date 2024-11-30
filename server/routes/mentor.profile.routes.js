import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getMentorProfile,
  updateBasicInfo,
  updateExpertise,
  updateEducation,
  updateSocialLinks,
  updateCustomUrl,
  updateAvatar
} from '../controllers/mentor.profile.controller.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('mentor'));

// Get profile
router.get('/profile', getMentorProfile);

// Update basic info
router.put(
  '/profile/basic',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('title').optional().isString().trim().notEmpty(),
    body('company').optional().isString().trim().notEmpty(),
    body('about').optional().isString().trim().isLength({ min: 100 }),
    body('hourlyRate').optional().isInt({ min: 0 }),
    validate
  ],
  updateBasicInfo
);

// Update expertise
router.put(
  '/profile/expertise',
  [
    body('expertise').isArray().notEmpty(),
    body('languages').isArray().notEmpty(),
    validate
  ],
  updateExpertise
);

// Update education
router.put(
  '/profile/education',
  [
    body('education').isArray(),
    body('education.*.degree').isString().notEmpty(),
    body('education.*.institution').isString().notEmpty(),
    body('education.*.year').isInt({ min: 1900, max: new Date().getFullYear() }),
    validate
  ],
  updateEducation
);

// Update social links
router.put(
  '/profile/social',
  [
    body('socialLinks').isArray(),
    body('socialLinks.*.platform').isIn(['twitter', 'linkedin', 'github', 'website']),
    body('socialLinks.*.url').isURL(),
    validate
  ],
  updateSocialLinks
);

// Update custom URL
router.put(
  '/profile/custom-url',
  [
    body('customUrl')
      .matches(/^[a-zA-Z0-9-]+$/)
      .withMessage('Custom URL can only contain letters, numbers, and hyphens')
      .isLength({ min: 3, max: 30 })
      .withMessage('Custom URL must be between 3 and 30 characters'),
    validate
  ],
  updateCustomUrl
);

// Update avatar
router.put('/profile/avatar', updateAvatar);

export default router;