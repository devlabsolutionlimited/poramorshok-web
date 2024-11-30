import { Message, Conversation } from '../models/Message.js';
import { ApiError } from '../utils/ApiError.js';

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId
    })
      .populate('participants', 'name avatar')
      .populate('lastMessage');

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort('createdAt');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, content } = req.body;

    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({
          participants: [req.user._id, receiverId]
        });

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user._id,
      receiverId,
      content
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      throw new ApiError(404, 'Message not found');
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};