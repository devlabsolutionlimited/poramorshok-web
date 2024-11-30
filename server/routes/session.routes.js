import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createSession,
  getUserSessions,
  getSessionById,
  updateSessionStatus,
  addSessionFeedback
} from '../controllers/session.controller.js';

const router = express.Router();

router.use(protect);

router.post('/', createSession);
router.get('/user/:userId', getUserSessions);
router.get('/:id', getSessionById);
router.put('/:id/status', updateSessionStatus);
router.post('/:id/feedback', addSessionFeedback);

export default router;