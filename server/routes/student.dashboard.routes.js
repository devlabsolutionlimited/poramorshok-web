import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getStudentDashboard } from '../controllers/student.dashboard.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getStudentDashboard);

export default router;