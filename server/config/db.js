import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    // Configure mongoose
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(env.MONGODB_URI, {
     // useNewUrlParser: true,
     // useUnifiedTopology: true
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    console.log(`MongoDB Connected: ${error.message}`);
    process.exit(1);
  }
};

// devratul