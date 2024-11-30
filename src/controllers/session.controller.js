import Session from '../models/Session.js';
import { ApiError } from '../utils/ApiError.js';
import { generateVerificationCode } from '../utils/session.js';
import { sendSessionEmail } from '../utils/email.js';

export const startSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    // Generate unique verification code for the session
    const verificationCode = generateVerificationCode();
    session.verificationCode = verificationCode;
    
    // Record join time
    if (req.user.id === session.mentorId.toString()) {
      session.mentorJoinedAt = new Date();
    } else {
      session.joinedAt = new Date();
    }

    // Log activity
    session.activityLog.push({
      action: 'join',
      userId: req.user.id,
      timestamp: new Date()
    });

    await session.save();

    // Send verification code to both parties
    await sendSessionEmail(session, 'verification_code');

    res.json({ success: true, verificationCode });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    // Record leave time
    if (req.user.id === session.mentorId.toString()) {
      session.mentorLeftAt = new Date();
    } else {
      session.leftAt = new Date();
    }

    // Verify session completion
    const { verificationCode } = req.body;
    if (verificationCode === session.verificationCode) {
      session.isVerified = true;
      session.status = 'completed';
    }

    // Log activity
    session.activityLog.push({
      action: 'leave',
      userId: req.user.id,
      timestamp: new Date(),
      metadata: { verificationCode }
    });

    await session.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const requestRefund = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      throw new ApiError(404, 'Session not found');
    }

    // Verify refund eligibility
    const isEligible = await verifyRefundEligibility(session);
    if (!isEligible) {
      throw new ApiError(400, 'Session is not eligible for refund');
    }

    // Check activity logs
    const hasValidActivity = verifySessionActivity(session);
    if (!hasValidActivity) {
      throw new ApiError(400, 'Invalid session activity detected');
    }

    // Check time constraints
    const isWithinTimeLimit = checkRefundTimeLimit(session);
    if (!isWithinTimeLimit) {
      throw new ApiError(400, 'Refund time limit exceeded');
    }

    session.status = 'disputed';
    await session.save();

    res.json({ success: true, message: 'Refund request is under review' });
  } catch (error) {
    next(error);
  }
};

const verifyRefundEligibility = async (session) => {
  // Check if session was actually started
  if (!session.joinedAt || !session.mentorJoinedAt) {
    return false;
  }

  // Check for verification code usage
  if (!session.verificationCode) {
    return false;
  }

  // Check activity logs for suspicious patterns
  const suspiciousActivity = session.activityLog.some(log => {
    // Add logic to detect suspicious patterns
    return false;
  });

  if (suspiciousActivity) {
    return false;
  }

  return true;
};

const verifySessionActivity = (session) => {
  // Verify session duration matches expected duration
  const actualDuration = calculateSessionDuration(session);
  const expectedDuration = session.duration * 60 * 1000; // Convert to milliseconds
  
  if (actualDuration < expectedDuration * 0.8) { // 80% threshold
    return false;
  }

  // Check for continuous activity
  const hasGaps = checkActivityGaps(session.activityLog);
  if (hasGaps) {
    return false;
  }

  return true;
};

const calculateSessionDuration = (session) => {
  const start = Math.max(
    session.joinedAt.getTime(),
    session.mentorJoinedAt.getTime()
  );
  const end = Math.min(
    session.leftAt.getTime(),
    session.mentorLeftAt.getTime()
  );
  return end - start;
};

const checkActivityGaps = (activityLog) => {
  // Check for suspicious gaps in activity
  const MAX_GAP_MINUTES = 5;
  
  for (let i = 1; i < activityLog.length; i++) {
    const gap = activityLog[i].timestamp - activityLog[i-1].timestamp;
    if (gap > MAX_GAP_MINUTES * 60 * 1000) {
      return true;
    }
  }
  
  return false;
};

const checkRefundTimeLimit = (session) => {
  const REFUND_WINDOW_HOURS = 24;
  const now = new Date();
  const sessionEnd = session.leftAt || session.mentorLeftAt;
  
  if (!sessionEnd) return false;
  
  const hoursSinceSession = (now - sessionEnd) / (1000 * 60 * 60);
  return hoursSinceSession <= REFUND_WINDOW_HOURS;
};