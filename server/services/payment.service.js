import { PaymentMethod, Withdrawal, Earning } from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export class PaymentService {
  static async getPaymentStats(userId) {
    try {
      const earnings = await Earning.find({
        userId,
        status: 'completed'
      });

      const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
      const pendingPayouts = await this.getPendingAmount(userId);
      const availableBalance = await this.getAvailableBalance(userId);

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

      return {
        balance: availableBalance,
        pendingPayouts,
        nextPayout: nextPayout.toISOString(),
        totalEarnings,
        monthlyEarnings: Object.entries(monthlyEarnings).map(([month, amount]) => ({
          month,
          amount
        }))
      };
    } catch (error) {
      logger.error('Get payment stats error:', error);
      throw error;
    }
  }

  static async getPaymentMethods(userId) {
    try {
      return await PaymentMethod.find({ userId });
    } catch (error) {
      logger.error('Get payment methods error:', error);
      throw error;
    }
  }

  static async addPaymentMethod(userId, data) {
    try {
      const existingDefault = await PaymentMethod.findOne({
        userId,
        isDefault: true
      });

      const method = new PaymentMethod({
        userId,
        ...data,
        isDefault: !existingDefault
      });

      await method.save();
      return method;
    } catch (error) {
      logger.error('Add payment method error:', error);
      throw error;
    }
  }

  static async updatePaymentMethod(userId, methodId, data) {
    try {
      const method = await PaymentMethod.findOneAndUpdate(
        { _id: methodId, userId },
        data,
        { new: true }
      );

      if (!method) {
        throw new ApiError(404, 'Payment method not found');
      }

      return method;
    } catch (error) {
      logger.error('Update payment method error:', error);
      throw error;
    }
  }

  static async deletePaymentMethod(userId, methodId) {
    try {
      const method = await PaymentMethod.findOne({ _id: methodId, userId });
      if (!method) {
        throw new ApiError(404, 'Payment method not found');
      }

      if (method.isDefault) {
        const otherMethod = await PaymentMethod.findOne({
          userId,
          _id: { $ne: methodId }
        });
        if (otherMethod) {
          otherMethod.isDefault = true;
          await otherMethod.save();
        }
      }

      await method.remove();
    } catch (error) {
      logger.error('Delete payment method error:', error);
      throw error;
    }
  }

  static async getTransactions(userId) {
    try {
      const earnings = await Earning.find({ userId })
        .populate('sessionId')
        .sort({ createdAt: -1 });

      const withdrawals = await Withdrawal.find({ userId })
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

      return transactions;
    } catch (error) {
      logger.error('Get transactions error:', error);
      throw error;
    }
  }

  static async requestWithdrawal(userId, { amount, paymentMethodId }) {
    try {
      // Check minimum withdrawal amount
      if (amount < 1000) {
        throw new ApiError(400, 'Minimum withdrawal amount is ৳1,000');
      }

      // Check available balance
      const availableBalance = await this.getAvailableBalance(userId);
      if (amount > availableBalance) {
        throw new ApiError(400, 'Insufficient balance');
      }

      // Verify payment method exists and belongs to user
      const paymentMethod = await PaymentMethod.findOne({
        _id: paymentMethodId,
        userId
      });
      if (!paymentMethod) {
        throw new ApiError(404, 'Payment method not found');
      }

      const withdrawal = new Withdrawal({
        userId,
        amount,
        paymentMethodId
      });

      await withdrawal.save();
      return withdrawal;
    } catch (error) {
      logger.error('Request withdrawal error:', error);
      throw error;
    }
  }

  static async getWithdrawals(userId) {
    try {
      return await Withdrawal.find({ userId })
        .populate('paymentMethodId')
        .sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Get withdrawals error:', error);
      throw error;
    }
  }

  // Helper methods
  static async getAvailableBalance(userId) {
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
  }

  static async getPendingAmount(userId) {
    const pendingEarnings = await Earning.find({
      userId,
      status: 'pending'
    });

    return pendingEarnings.reduce(
      (sum, earning) => sum + earning.netAmount,
      0
    );
  }
}