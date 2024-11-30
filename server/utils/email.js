import { logger } from './logger.js';

export const sendSessionEmail = async (session, type) => {
  try {
    // Email templates
    const templates = {
      verification_code: {
        subject: 'Session Verification Code',
        body: `Your verification code for the session is: ${session.verificationCode}`
      },
      session_reminder: {
        subject: 'Upcoming Session Reminder',
        body: `Your session is scheduled to start in 30 minutes`
      },
      session_cancelled: {
        subject: 'Session Cancelled',
        body: `Your session has been cancelled`
      }
    };

    const template = templates[type];
    if (!template) {
      throw new Error(`Invalid email template type: ${type}`);
    }

    // In production, integrate with your email service provider
    // For now, just log the email
    logger.info('Sending email:', {
      to: session.studentId.email,
      subject: template.subject,
      body: template.body
    });

  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};