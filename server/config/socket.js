import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }
      const decoded = await verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join personal room
    socket.join(socket.userId);

    // Handle private messages
    socket.on('private-message', async ({ recipientId, content }) => {
      try {
        // Save message to database
        // Emit to recipient
        io.to(recipientId).emit('new-message', {
          senderId: socket.userId,
          content
        });
      } catch (error) {
        logger.error('Message error:', error);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};