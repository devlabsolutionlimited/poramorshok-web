export interface Evidence {
  type: string;
  content: string;
  timestamp: string;
}

export interface ActivityLog {
  type: string;
  description: string;
  timestamp: string;
}

export interface Resolution {
  status: string;
  reason: string;
  resolvedBy: string;
  resolvedAt: string;
}

export interface Incident {
  id: string;
  type: string;
  userId: string;
  userName: string;
  sessionId?: string;
  description: string;
  timestamp: string;
  status: string;
  riskScore: number;
  evidence?: Evidence[];
  activityLogs?: ActivityLog[];
  resolution?: Resolution;
}