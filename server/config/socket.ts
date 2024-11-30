import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';
import type { JwtPayload } from '../types/index.js';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }
      const decoded = await verifyToken(token) as JwtPayload;
      (socket as AuthenticatedSocket).userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join personal room
    socket.join(socket.userId);

    // Handle private messages
    socket.on('private-message', async ({ recipientId, content }: { recipientId: string; content: string }) => {
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