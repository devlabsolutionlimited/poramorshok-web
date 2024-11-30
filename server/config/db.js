import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    // Configure mongoose
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      writeConcern: {
        w: 'majority'
      }
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.error('MongoDB Connection Error:', error.message);
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};