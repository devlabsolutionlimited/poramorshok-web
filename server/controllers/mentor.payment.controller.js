import PaymentMethod from '../models/Payment.js';
import MentorProfile from '../models/MentorProfile.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getPaymentStats = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      throw new ApiError(404, 'Mentor profile not found');
    }

    // Calculate next payout date (15th of next month)
    const nextPayout = new Date();
    nextPayout.setDate(15);
    nextPayout.setMonth(nextPayout.getMonth() + 1);

    res.json({
      balance: profile.availableBalance || 0,
      pendingPayouts: 0,
      nextPayout: nextPayout.toISOString(),
      totalEarnings: profile.totalEarnings || 0,
      monthlyEarnings: [] // Implement actual monthly earnings calculation
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
        throw new ApiError(400, 'All bank account details are required');
      }
    } else if (!number) {
      throw new ApiError(400, 'Mobile number is required for mobile banking methods');
    }

    // Validate mobile number format for mobile banking methods
    if (type !== 'bank' && number) {
      if (!/^01[3-9]\d{8}$/.test(number)) {
        throw new ApiError(400, 'Invalid mobile number format');
      }
    }

    // Check if it's the first payment method for the user
    const existingMethods = await PaymentMethod.countDocuments({ userId: req.user._id });
    const isDefault = existingMethods === 0;

    const method = await PaymentMethod.create({
      userId: req.user._id,
      type,
      number,
      accountName,
      accountNumber,
      bankName,
      branchName,
      isDefault
    });

    res.status(201).json(method);
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