export interface SessionType {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  type: 'one-on-one' | 'group';
  maxParticipants?: number;
  topics: string[];
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  topic: string;
  studentName: string;
  studentAvatar?: string;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}