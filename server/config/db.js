import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const connectWithRetry = async (retries = 0) => {
  const maxRetries = parseInt(env.MONGODB_MAX_RETRIES || '5');
  const retryInterval = parseInt(env.MONGODB_RETRY_INTERVAL || '5000');

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4,
      maxPoolSize: 10,
      retryWrites: true,
      writeConcern: {
        w: 'majority',
        wtimeout: 2500
      },
      // Enable unified topology
      useUnifiedTopology: true,
      // Add heartbeat monitoring
      heartbeatFrequencyMS: 10000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.error('MongoDB Connection Error:', error.message);

    if (retries < maxRetries) {
      logger.info(`Retrying connection... Attempt ${retries + 1} of ${maxRetries}`);
      console.log(`Retrying connection... Attempt ${retries + 1} of ${maxRetries}`);
      
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      return connectWithRetry(retries + 1);
    }

    throw error;
  }
};

export const connectDB = async () => {
  try {
    // Configure mongoose
    mongoose.set('strictQuery', false);

    // Initial connection
    await connectWithRetry();

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      connectWithRetry();
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected successfully');
      console.log('MongoDB reconnected successfully');
    });

    mongoose.connection.on('reconnectFailed', () => {
      logger.error('MongoDB reconnection failed');
      console.error('MongoDB reconnection failed');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        logger.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};