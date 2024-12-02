import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Create admin user
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      permissions: [
        'manage_users',
        'manage_mentors',
        'manage_sessions',
        'manage_payments',
        'manage_content',
        'view_analytics',
        'manage_moderators'
      ],
      status: 'active'
    };

    // Create moderator user
    const moderatorData = {
      name: 'Moderator User',
      email: 'moderator@example.com',
      password: 'mod123',
      role: 'moderator',
      permissions: [
        'view_users',
        'view_mentors',
        'view_sessions',
        'view_reports'
      ],
      status: 'active'
    };

    const admin = await Admin.findOne({ email: adminData.email });
    if (!admin) {
      await Admin.create(adminData);
      logger.info('Default admin user created');
    }

    const moderator = await Admin.findOne({ email: moderatorData.email });
    if (!moderator) {
      await Admin.create(moderatorData);
      logger.info('Default moderator user created');
    }

    logger.info('Admin setup completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error creating admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();