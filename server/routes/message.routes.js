import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead
} from '../controllers/message.controller.js';

const router = express.Router();

router.use(protect);

router.get('/conversations/:userId', getConversations);
router.get('/conversation/:conversationId', getMessages);
router.post('/', sendMessage);
router.put('/read/:messageId', markAsRead);

export default router;