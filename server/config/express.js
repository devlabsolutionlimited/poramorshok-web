import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from '../middleware/errorHandler.js';
import authRoutes from '../routes/auth.routes.js';
import mentorRoutes from '../routes/mentor.routes.js';
import mentorPaymentRoutes from '../routes/mentor.payment.routes.js';
import mentorProfileRoutes from '../routes/mentor.profile.routes.js';
import sessionTypeRoutes from '../routes/session.type.routes.js';
import sessionRoutes from '../routes/session.routes.js';
import messageRoutes from '../routes/message.routes.js';
import paymentRoutes from '../routes/payment.routes.js';

export const configureExpress = () => {
  const app = express();

  // Security middleware
  app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        message: 'Too many requests, please try again later.'
      });
    },
    skip: (req) => process.env.NODE_ENV === 'development'
  });

  app.use(limiter);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime()
    });
  });

  // API Routes - All routes prefixed with /api
  app.use('/api/auth', authRoutes);
  app.use('/api/mentors', mentorRoutes);
  app.use('/api/mentor/payments', mentorPaymentRoutes);
  app.use('/api/mentor/profile', mentorProfileRoutes);
  app.use('/api/session-types', sessionTypeRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/payments', paymentRoutes);

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found'
    });
  });

  return app;
};