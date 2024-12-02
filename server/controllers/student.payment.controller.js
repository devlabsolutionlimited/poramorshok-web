import StudentPayment from '../models/StudentPayment.js';
import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await StudentPayment.find({ studentId: req.user._id })
      .populate('sessionId', 'topic date startTime duration')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    logger.error('Get payment history error:', error);
    next(error);
  }
};

export const getPaymentStats = async (req, res, next) => {
  try {
    const stats = await StudentPayment.aggregate([
      { $match: { studentId: req.user._id } },
      { $group: {
        _id: null,
        totalSpent: { $sum: '$amount' },
        totalSessions: { $sum: 1 },
        refundedAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'refunded'] }, '$amount', 0]
          }
        }
      }}
    ]);

    const monthlySpending = await StudentPayment.aggregate([
      { $match: { 
        studentId: req.user._id,
        status: 'completed'
      }},
      { $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        amount: { $sum: '$amount' }
      }},
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalSpent: stats[0]?.totalSpent || 0,
      totalSessions: stats[0]?.totalSessions || 0,
      refundedAmount: stats[0]?.refundedAmount || 0,
      monthlySpending: monthlySpending.map(item => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        amount: item.amount
      }))
    });
  } catch (error) {
    logger.error('Get payment stats error:', error);
    next(error);
  }
};

export const requestRefund = async (req, res, next) => {
  try {
    const { sessionId, reason } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      studentId: req.user._id
    });

    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    if (session.status !== 'cancelled') {
      throw new ApiError(400, 'Refund can only be requested for cancelled sessions');
    }

    const payment = await StudentPayment.findOne({
      sessionId,
      studentId: req.user._id
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new ApiError(400, 'Refund can only be requested for completed payments');
    }

    payment.status = 'refunded';
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    await payment.save();

    res.json(payment);
  } catch (error) {
    logger.error('Request refund error:', error);
    next(error);
  }
};