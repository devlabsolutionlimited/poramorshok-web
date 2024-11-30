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
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}