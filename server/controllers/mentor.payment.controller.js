import { PaymentMethod, Withdrawal, Earning } from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find({ userId: req.user.id });
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

    // Check if it's the first payment method for the user
    const existingMethods = await PaymentMethod.countDocuments({ userId: req.user.id });
    const isDefault = existingMethods === 0;

    const method = await PaymentMethod.create({
      userId: req.user.id,
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
      { _id: req.params.id, userId: req.user.id },
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
      userId: req.user.id
    });

    if (!method) {
      throw new ApiError(404, 'Payment method not found');
    }

    // If deleted method was default, set another method as default
    if (method.isDefault) {
      const anotherMethod = await PaymentMethod.findOne({ userId: req.user.id });
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

export const getPaymentStats = async (req, res, next) => {
  try {
    const earnings = await Earning.find({
      userId: req.user.id,
      status: 'completed'
    });

    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
    const pendingPayouts = await getPendingAmount(req.user.id);
    const availableBalance = await getAvailableBalance(req.user.id);

    // Calculate monthly earnings
    const monthlyEarnings = earnings.reduce((acc, earning) => {
      const month = new Date(earning.createdAt).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + earning.netAmount;
      return acc;
    }, {});

    // Calculate next payout date (15th of next month)
    const nextPayout = new Date();
    nextPayout.setDate(15);
    nextPayout.setMonth(nextPayout.getMonth() + 1);

    res.json({
      balance: availableBalance,
      pendingPayouts,
      nextPayout: nextPayout.toISOString(),
      totalEarnings,
      monthlyEarnings: Object.entries(monthlyEarnings).map(([month, amount]) => ({
        month,
        amount
      }))
    });
  } catch (error) {
    logger.error('Get payment stats error:', error);
    next(error);
  }
};

// Helper functions
const getAvailableBalance = async (userId) => {
  const completedEarnings = await Earning.find({
    userId,
    status: 'completed'
  });

  const withdrawals = await Withdrawal.find({
    userId,
    status: { $in: ['completed', 'processing'] }
  });

  const totalEarnings = completedEarnings.reduce(
    (sum, earning) => sum + earning.netAmount,
    0
  );

  const totalWithdrawals = withdrawals.reduce(
    (sum, withdrawal) => sum + withdrawal.amount,
    0
  );

  return totalEarnings - totalWithdrawals;
};

const getPendingAmount = async (userId) => {
  const pendingEarnings = await Earning.find({
    userId,
    status: 'pending'
  });

  return pendingEarnings.reduce(
    (sum, earning) => sum + earning.netAmount,
    0
  );
};