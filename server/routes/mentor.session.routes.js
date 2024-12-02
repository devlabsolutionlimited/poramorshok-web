import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { ensureMentorProfile } from '../middleware/ensureMentorProfile.js';
import {
  getMentorDashboard,
  getMentorSessions,
  getSessionStats
} from '../controllers/mentor.session.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('mentor'));
router.use(ensureMentorProfile);

router.get('/dashboard', getMentorDashboard);
router.get('/sessions', getMentorSessions);
router.get('/sessions/stats', getSessionStats);

export default router;