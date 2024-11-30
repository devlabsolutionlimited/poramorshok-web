import jwt from 'jsonwebtoken';
import { ApiError } from './ApiError.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(new ApiError(401, 'Invalid token'));
      } else {
        resolve(decoded);
      }
    });
  });
};