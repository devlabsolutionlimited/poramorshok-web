import { env, isDev } from './config/env.js';
import { configureExpress } from './config/express.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Connect to MongoDB with retries
    const maxRetries = 5;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        await connectDB();
        break; // Connection successful, exit retry loop
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          logger.error('Failed to connect to MongoDB after maximum retries');
          throw error;
        }
        logger.warn(`MongoDB connection attempt ${retries} failed. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }

    // Initialize Express app
    const app = configureExpress();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      if (isDev) {
        logger.info(`API URL: ${env.CLIENT_URL}`);
      }
    });

    // Initialize Socket.IO
    initializeSocket(server);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
      // Don't exit the process, just log the error
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      // Don't exit the process, just log the error
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    // Don't exit the process, let it retry
    setTimeout(startServer, 5000); // Retry starting server after 5 seconds
  }
};

startServer();