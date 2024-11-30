import { Session } from '@/types/session';
import { FraudDetectionResult } from './fraud-detection';

export interface ReportEvidence {
  type: 'screenshot' | 'chat_log' | 'activity_log' | 'system_log';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ReportAnalysis {
  consistencyScore: number;
  evidenceStrength: number;
  timelineAccuracy: number;
  overallCredibility: number;
  flags: string[];
  recommendation: string;
}

export function analyzeReport(
  session: Session,
  evidence: ReportEvidence[],
  fraudDetection: FraudDetectionResult
): ReportAnalysis {
  const flags: string[] = [];
  let consistencyScore = 100;
  let evidenceStrength = 100;
  let timelineAccuracy = 100;

  // Check timeline consistency
  if (!isTimelineConsistent(evidence, session)) {
    flags.push('Timeline inconsistency detected');
    timelineAccuracy -= 30;
  }

  // Verify evidence completeness
  const evidenceCompleteness = checkEvidenceCompleteness(evidence);
  if (!evidenceCompleteness.complete) {
    flags.push(evidenceCompleteness.reason);
    evidenceStrength -= 25;
  }

  // Cross-reference with fraud detection
  if (fraudDetection.riskScore > 50) {
    flags.push('High risk score from fraud detection');
    consistencyScore -= 20;
  }

  // Check for contradictions in evidence
  const contradictions = findContradictions(evidence);
  if (contradictions.length > 0) {
    flags.push(...contradictions);
    consistencyScore -= 15 * contradictions.length;
  }

  // Calculate overall credibility
  const overallCredibility = calculateOverallCredibility(
    consistencyScore,
    evidenceStrength,
    timelineAccuracy,
    fraudDetection.riskScore
  );

  return {
    consistencyScore: Math.max(0, consistencyScore),
    evidenceStrength: Math.max(0, evidenceStrength),
    timelineAccuracy: Math.max(0, timelineAccuracy),
    overallCredibility: Math.max(0, overallCredibility),
    flags,
    recommendation: generateRecommendation(overallCredibility, flags)
  };
}

function isTimelineConsistent(evidence: ReportEvidence[], session: Session): boolean {
  // Sort evidence by timestamp
  const sortedEvidence = [...evidence].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Check if evidence timestamps fall within session timeframe
  const sessionStart = new Date(session.date + 'T' + session.startTime);
  const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);

  return sortedEvidence.every(e => 
    e.timestamp >= sessionStart && e.timestamp <= sessionEnd
  );
}

function checkEvidenceCompleteness(evidence: ReportEvidence[]): {
  complete: boolean;
  reason?: string;
} {
  const requiredTypes = ['activity_log', 'chat_log'];
  const availableTypes = new Set(evidence.map(e => e.type));

  for (const type of requiredTypes) {
    if (!availableTypes.has(type)) {
      return {
        complete: false,
        reason: `Missing required evidence: ${type}`
      };
    }
  }

  return { complete: true };
}

function findContradictions(evidence: ReportEvidence[]): string[] {
  const contradictions: string[] = [];

  // Check for contradicting timestamps in logs
  const activityLogs = evidence.filter(e => e.type === 'activity_log');
  const chatLogs = evidence.filter(e => e.type === 'chat_log');

  // Compare activity logs with chat logs
  for (const activity of activityLogs) {
    const relatedChats = chatLogs.filter(chat => 
      Math.abs(chat.timestamp.getTime() - activity.timestamp.getTime()) < 60000
    );

    if (activity.metadata?.status === 'inactive' && relatedChats.length > 0) {
      contradictions.push('Chat activity detected during reported inactivity period');
    }
  }

  return contradictions;
}

function calculateOverallCredibility(
  consistencyScore: number,
  evidenceStrength: number,
  timelineAccuracy: number,
  fraudRiskScore: number
): number {
  // Weighted average of all factors
  const weights = {
    consistency: 0.3,
    evidence: 0.25,
    timeline: 0.25,
    fraudRisk: 0.2
  };

  return (
    consistencyScore * weights.consistency +
    evidenceStrength * weights.evidence +
    timelineAccuracy * weights.timeline +
    (100 - fraudRiskScore) * weights.fraudRisk
  );
}

function generateRecommendation(credibility: number, flags: string[]): string {
  if (credibility < 40) {
    return 'Reject - Low credibility and multiple red flags';
  }
  
  if (credibility < 60) {
    return 'Investigate - Some concerns require further review';
  }
  
  if (credibility < 80) {
    return 'Review - Generally credible but verify key points';
  }
  
  return 'Approve - High credibility with strong supporting evidence';
}