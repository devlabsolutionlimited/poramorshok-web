import type { Session } from '@/types/session';

export interface Report {
  id: string;
  type: 'refund_request' | 'session_dispute';
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  sessionId: string;
  studentName: string;
  mentorName: string;
  createdAt: string;
  description: string;
  session: Session;
  activityLogs: any[];
  evidence: any[];
  riskScore?: number;
}