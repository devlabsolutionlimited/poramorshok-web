import Stripe from 'stripe';
import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'bdt',
      metadata: {
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, sessionId } = req.body;

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

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const sessions = await Session.find({
      $or: [
        { studentId: req.user._id },
        { mentorId: req.user._id }
      ],
      paymentId: { $exists: true }
    }).populate('mentorId studentId', 'name avatar');

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};