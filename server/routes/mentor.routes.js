import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMentors,
  getMentorById,
  createMentorProfile,
  updateMentorProfile,
  getMentorReviews
} from '../controllers/mentor.controller.js';

const router = express.Router();

router.get('/', getMentors);
router.get('/:id', getMentorById);
router.get('/:id/reviews', getMentorReviews);
router.post('/profile', protect, createMentorProfile);
router.put('/profile', protect, updateMentorProfile);

export default router;