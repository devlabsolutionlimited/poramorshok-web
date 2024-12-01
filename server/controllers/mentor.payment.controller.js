import { PaymentService } from '../services/payment.service.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getPaymentStats = async (req, res, next) => {
  try {
    const stats = await PaymentService.getPaymentStats(req.user.id);
    res.json(stats);
  } catch (error) {
    logger.error('Get payment stats error:', error);
    next(error);
  }
};

export const getPaymentMethods = async (req, res, next) => {
  try {
    const methods = await PaymentService.getPaymentMethods(req.user.id);
    res.json(methods);
  } catch (error) {
    logger.error('Get payment methods error:', error);
    next(error);
  }
};

export const addPaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentService.addPaymentMethod(req.user.id, req.body);
    res.status(201).json(method);
  } catch (error) {
    logger.error('Add payment method error:', error);
    next(error);
  }
};

export const updatePaymentMethod = async (req, res, next) => {
  try {
    const method = await PaymentService.updatePaymentMethod(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(method);
  } catch (error) {
    logger.error('Update payment method error:', error);
    next(error);
  }
};

export const deletePaymentMethod = async (req, res, next) => {
  try {
    await PaymentService.deletePaymentMethod(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error('Delete payment method error:', error);
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await PaymentService.getTransactions(req.user.id);
    res.json(transactions);
  } catch (error) {
    logger.error('Get transactions error:', error);
    next(error);
  }
};

export const requestWithdrawal = async (req, res, next) => {
  try {
    const withdrawal = await PaymentService.requestWithdrawal(
      req.user.id,
      req.body
    );
    res.status(201).json(withdrawal);
  } catch (error) {
    logger.error('Request withdrawal error:', error);
    next(error);
  }
};

export const getWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await PaymentService.getWithdrawals(req.user.id);
    res.json(withdrawals);
  } catch (error) {
    logger.error('Get withdrawals error:', error);
    next(error);
  }
};