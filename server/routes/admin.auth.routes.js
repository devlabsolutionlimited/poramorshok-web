import express from 'express';
import { body } from 'express-validator';
import { login, getMe } from '../controllers/admin.auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
];

router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

export default router;