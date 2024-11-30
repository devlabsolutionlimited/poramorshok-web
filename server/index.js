import { env, isDev } from './config/env.js';
import { configureExpress } from './config/express.js';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Express app
    const app = configureExpress();

    // Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`)
      if (isDev) {
        logger.info(`API URL: ${env.CLIENT_URL}`);
      }
    });

    // Initialize Socket.IO
    initializeSocket(server);

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();