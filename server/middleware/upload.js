import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { ApiError } from '../utils/ApiError.js';

// Ensure upload directories exist
const createUploadDirs = async () => {
  const dirs = [
    'uploads',
    'uploads/avatars',
    'uploads/temp'
  ];

  for (const dir of dirs) {
    await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
  }
};

// Create upload directories on startup
createUploadDirs().catch(console.error);

// Configure storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new ApiError(400, 'Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});