import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ensureMentorProfile } from '../middleware/ensureMentorProfile.js';
import {
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentStats,
  getTransactions
} from '../controllers/mentor.payment.controller.js';

const router = express.Router();

// Protect all routes and ensure mentor profile exists
router.use(protect);
router.use(authorize('mentor'));
router.use(ensureMentorProfile);

// Payment Stats
router.get('/stats', getPaymentStats);

// Payment Methods
router.get('/methods', getPaymentMethods);
router.get('/transactions', getTransactions);

router.post(
  '/methods',
  [
    body('type').isIn(['bkash', 'nagad', 'bank']).withMessage('Invalid payment method type'),
    body('number').if(body('type').isIn(['bkash', 'nagad']))
      .matches(/^01[3-9]\d{8}$/).withMessage('Invalid mobile number'),
    body('accountName').if(body('type').equals('bank'))
      .notEmpty().withMessage('Account name is required'),
    body('accountNumber').if(body('type').equals('bank'))
      .notEmpty().withMessage('Account number is required'),
    body('bankName').if(body('type').equals('bank'))
      .notEmpty().withMessage('Bank name is required'),
    body('branchName').if(body('type').equals('bank'))
      .notEmpty().withMessage('Branch name is required'),
    validate
  ],
  addPaymentMethod
);

router.put(
  '/methods/:id',
  [
    body('type').optional().isIn(['bkash', 'nagad', 'bank']),
    body('number').optional().matches(/^01[3-9]\d{8}$/),
    body('accountName').optional().notEmpty(),
    body('accountNumber').optional().notEmpty(),
    body('bankName').optional().notEmpty(),
    body('branchName').optional().notEmpty(),
    validate
  ],
  updatePaymentMethod
);

router.delete('/methods/:id', deletePaymentMethod);

export default router;