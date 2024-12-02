import MentorProfile from '../models/MentorProfile.js';
import PaymentMethod from '../models/Payment.js';
import Transaction from '../models/Transaction.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getPaymentStats = async (req, res, next) => {
  try {
    // Get all completed transactions
    const completedTransactions = await Transaction.find({
      mentorId: req.user._id,
      status: 'completed'
    });

    // Calculate total earnings
    const totalEarnings = completedTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get pending transactions
    const pendingTransactions = await Transaction.find({
      mentorId: req.user._id,
      status: 'pending'
    });

    // Calculate pending payouts
    const pendingPayouts = pendingTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Count completed sessions (unique sessionIds from completed transactions)
    const completedSessions = new Set(
      completedTransactions.map(t => t.sessionId.toString())
    ).size;

    res.json({
      totalEarnings,
      pendingPayouts,
      completedSessions,
      nextPayout: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        15
      ).toISOString()
    });
  } catch (error) {
    logger.error('Get payment stats error:', error);
    next(error);
  }
};

export const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find({ userId: req.user._id });
    res.json(methods);
  } catch (error) {
    logger.error('Get payment methods error:', error);
    next(error);
  }
};

export const addPaymentMethod = async (req, res, next) => {
  try {
    const { type, number, accountName, accountNumber, bankName, branchName } = req.body;

    // Validate required fields based on type
    if (type === 'bank') {
      if (!accountName || !accountNumber || !bankName || !branchName) {
        throw new ApiError(400, 'All bank account details are required', {
          accountName: !accountName ? 'Account name is required' : null,
          accountNumber: !accountNumber ? 'Account number is required' : null,
          bankName: !bankName ? 'Bank name is required' : null,
          branchName: !branchName ? 'Branch name is required' : null
        });
      }
    } else if (!number) {
      throw new ApiError(400, 'Mobile number is required for mobile banking methods', {
        number: 'Mobile number is required'
      });
    }

    // Validate mobile number format for mobile banking methods
    if (type !== 'bank' && number) {
      if (!/^01[3-9]\d{8}$/.test(number)) {
        throw new ApiError(400, 'Invalid mobile number format', {
          number: 'Mobile number must start with 01 and be 11 digits long'
        });
      }
    }

    // Check if it's the first payment method for the user
    const existingMethods = await PaymentMethod.countDocuments({ userId: req.user._id });
    const isDefault = existingMethods === 0;

    // Create the payment method
    const method = new PaymentMethod({
      userId: req.user._id,
      type,
      number,
      accountName,
      accountNumber,
      bankName,
      branchName,
      isDefault
    });

    // Save with error handling
    try {
      await method.save();
      logger.info(`Payment method created for user ${req.user._id}`);
      res.status(201).json(method);
    } catch (dbError) {
      logger.error('Database error while saving payment method:', dbError);
      if (dbError.name === 'ValidationError') {
        throw new ApiError(400, 'Invalid payment method data', 
          Object.fromEntries(
            Object.entries(dbError.errors).map(([key, value]) => [key, value.message])
          )
        );
      }
      throw new ApiError(500, 'Failed to save payment method');
    }
  } catch (error) {
    logger.error('Add payment method error:', error);
    next(error);
  }
};

export const updatePaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!method) {
      throw new ApiError(404, 'Payment method not found');
    }

    res.json(method);
  } catch (error) {
    logger.error('Update payment method error:', error);
    next(error);
  }
};

export const deletePaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentMethod.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!method) {
      throw new ApiError(404, 'Payment method not found');
    }

    // If deleted method was default, set another method as default
    if (method.isDefault) {
      const anotherMethod = await PaymentMethod.findOne({ userId: req.user._id });
      if (anotherMethod) {
        anotherMethod.isDefault = true;
        await anotherMethod.save();
      }
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Delete payment method error:', error);
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ mentorId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('studentId', 'name')
      .populate('sessionId', 'title');

    // Format the response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      sessionId: transaction.sessionId?._id,
      sessionTitle: transaction.sessionId?.title,
      studentName: transaction.studentId?.name,
      paymentMethod: transaction.paymentMethod
    }));

    res.json(formattedTransactions);
  } catch (error) {
    logger.error('Get transactions error:', error);
    next(error);
  }
};