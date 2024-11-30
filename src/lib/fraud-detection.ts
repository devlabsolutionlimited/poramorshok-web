import { Session } from '@/types/session';

export interface ActivityLog {
  action: 'join' | 'leave' | 'screen_share' | 'chat' | 'verification';
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface FraudDetectionResult {
  riskScore: number;
  flags: string[];
  evidence: {
    sessionLogs: boolean;
    screenshots: boolean;
    verificationCode: boolean;
    activityTimeline: boolean;
  };
  recommendation: 'approve' | 'reject' | 'investigate';
}

export function calculateRiskScore(session: Session, activityLogs: ActivityLog[]): FraudDetectionResult {
  const flags: string[] = [];
  let riskScore = 0;

  // Check session duration
  const sessionDuration = calculateSessionDuration(activityLogs);
  const expectedDuration = session.duration * 60 * 1000; // Convert to milliseconds
  
  if (sessionDuration < expectedDuration * 0.8) {
    flags.push('Session duration significantly shorter than scheduled');
    riskScore += 30;
  }

  // Check for suspicious gaps in activity
  const suspiciousGaps = detectActivityGaps(activityLogs);
  if (suspiciousGaps) {
    flags.push('Suspicious gaps in session activity detected');
    riskScore += 20;
  }

  // Verify participant presence
  const participantPresence = verifyParticipantPresence(activityLogs, session);
  if (!participantPresence.bothPresent) {
    flags.push('One or more participants were absent during parts of the session');
    riskScore += 25;
  }

  // Check verification code usage
  const verificationValid = verifySessionCode(activityLogs);
  if (!verificationValid) {
    flags.push('Session verification code was not properly used');
    riskScore += 15;
  }

  // Check for screenshot evidence
  const hasScreenshots = checkScreenshotEvidence(activityLogs);
  if (!hasScreenshots) {
    flags.push('No screenshot evidence available');
    riskScore += 10;
  }

  const evidence = {
    sessionLogs: activityLogs.length > 0,
    screenshots: hasScreenshots,
    verificationCode: verificationValid,
    activityTimeline: !suspiciousGaps
  };

  return {
    riskScore,
    flags,
    evidence,
    recommendation: determineRecommendation(riskScore)
  };
}

function calculateSessionDuration(logs: ActivityLog[]): number {
  if (logs.length < 2) return 0;
  
  const startTime = logs[0].timestamp;
  const endTime = logs[logs.length - 1].timestamp;
  
  return endTime.getTime() - startTime.getTime();
}

function detectActivityGaps(logs: ActivityLog[]): boolean {
  const MAX_GAP_MINUTES = 5;
  
  for (let i = 1; i < logs.length; i++) {
    const gap = logs[i].timestamp.getTime() - logs[i-1].timestamp.getTime();
    if (gap > MAX_GAP_MINUTES * 60 * 1000) {
      return true;
    }
  }
  
  return false;
}

function verifyParticipantPresence(logs: ActivityLog[], session: Session): { bothPresent: boolean } {
  const mentorActions = logs.filter(log => log.userId === session.mentorId);
  const studentActions = logs.filter(log => log.userId === session.studentId);
  
  const bothPresent = mentorActions.length > 0 && studentActions.length > 0;
  
  return { bothPresent };
}

function verifySessionCode(logs: ActivityLog[]): boolean {
  const verificationLogs = logs.filter(log => log.action === 'verification');
  return verificationLogs.length >= 2; // Both participants should verify
}

function checkScreenshotEvidence(logs: ActivityLog[]): boolean {
  return logs.some(log => log.metadata?.screenshots?.length > 0);
}

function determineRecommendation(riskScore: number): 'approve' | 'reject' | 'investigate' {
  if (riskScore < 30) return 'approve';
  if (riskScore > 70) return 'reject';
  return 'investigate';
}