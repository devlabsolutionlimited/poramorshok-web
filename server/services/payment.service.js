import Stripe from 'stripe';
import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class PaymentService {
  static async createPaymentIntent(amount, metadata) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'bdt',
        metadata
      });

      logger.info(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Create payment intent error:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId, sessionId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new ApiError(400, 'Payment not successful');
      }

      const session = await Session.findByIdAndUpdate(
        sessionId,
        {
          status: 'confirmed',
          paymentId: paymentIntentId
        },
        { new: true }
      );

      logger.info(`Payment confirmed for session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error('Confirm payment error:', error);
      throw error;
    }
  }

  static async processRefund(paymentIntentId, reason) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason
      });

      logger.info(`Refund processed: ${refund.id}`);
      return refund;
    } catch (error) {
      logger.error('Process refund error:', error);
      throw error;
    }
  }

  static async getPaymentHistory(userId) {
    try {
      const sessions = await Session.find({
        $or: [
          { studentId: userId },
          { mentorId: userId }
        ],
        paymentId: { $exists: true }
      }).populate('mentorId studentId', 'name avatar');

      return sessions;
    } catch (error) {
      logger.error('Get payment history error:', error);
      throw error;
    }
  }
}