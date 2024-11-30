import crypto from 'crypto';

export const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

export const calculateSessionDuration = (session) => {
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

export const checkActivityGaps = (activityLog) => {
  const MAX_GAP_MINUTES = 5;
  
  for (let i = 1; i < activityLog.length; i++) {
    const gap = activityLog[i].timestamp - activityLog[i-1].timestamp;
    if (gap > MAX_GAP_MINUTES * 60 * 1000) {
      return true;
    }
  }
  
  return false;
};

export const verifySessionActivity = (session) => {
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