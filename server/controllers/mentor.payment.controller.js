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
      { new: true }
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

export const getTransactions = async (req, res, next) => {
  try {
    const earnings = await Earning.find({ userId: req.user.id })
      .populate('sessionId')
      .sort({ createdAt: -1 });

    const withdrawals = await Withdrawal.find({ userId: req.user.id })
      .populate('paymentMethodId')
      .sort({ createdAt: -1 });

    // Combine and format transactions
    const transactions = [
      ...earnings.map(earning => ({
        id: earning._id,
        type: 'earning',
        amount: earning.netAmount,
        date: earning.createdAt,
        status: earning.status,
        description: `Session earnings - ${earning.sessionId?.topic || 'Unknown session'}`
      })),
      ...withdrawals.map(withdrawal => ({
        id: withdrawal._id,
        type: 'withdrawal',
        amount: withdrawal.amount,
        date: withdrawal.createdAt,
        status: withdrawal.status,
        description: `Withdrawal to ${withdrawal.paymentMethodId?.type === 'bank' 
          ? `${withdrawal.paymentMethodId.bankName}`
          : `${withdrawal.paymentMethodId.type.toUpperCase()}`}`
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(transactions);
  } catch (error) {
    logger.error('Get transactions error:', error);
    next(error);
  }
};

export const requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, paymentMethodId } = req.body;

    // Check minimum withdrawal amount
    if (amount < 1000) {
      throw new ApiError(400, 'Minimum withdrawal amount is ৳1,000');
    }

    // Check available balance
    const availableBalance = await getAvailableBalance(req.user.id);
    if (amount > availableBalance) {
      throw new ApiError(400, 'Insufficient balance');
    }

    // Verify payment method exists and belongs to user
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      userId: req.user.id
    });
    if (!paymentMethod) {
      throw new ApiError(404, 'Payment method not found');
    }

    const withdrawal = await Withdrawal.create({
      userId: req.user.id,
      amount,
      paymentMethodId
    });

    res.status(201).json(withdrawal);
  } catch (error) {
    logger.error('Request withdrawal error:', error);
    next(error);
  }
};

export const getWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id })
      .populate('paymentMethodId')
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    logger.error('Get withdrawals error:', error);
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