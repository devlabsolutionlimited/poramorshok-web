import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { ensureMentorProfile } from '../middleware/ensureMentorProfile.js';
import {
  getMentorAnalytics,
  getSessionStats,
  getEarningsStats
} from '../controllers/mentor.analytics.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('mentor'));
router.use(ensureMentorProfile);

router.get('/analytics', getMentorAnalytics);
router.get('/sessions/stats', getSessionStats);
router.get('/earnings/stats', getEarningsStats);

export default router;