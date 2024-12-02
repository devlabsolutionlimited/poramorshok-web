import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getPaymentHistory,
  getPaymentStats,
  requestRefund
} from '../controllers/student.payment.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/history', getPaymentHistory);
router.get('/stats', getPaymentStats);

router.post('/refund',
  [
    body('sessionId').isMongoId().withMessage('Invalid session ID'),
    body('reason').isString().notEmpty().withMessage('Refund reason is required'),
    validate
  ],
  requestRefund
);

export default router;