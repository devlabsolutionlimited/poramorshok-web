export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'mentor' | 'moderator' | 'admin';
  avatar?: string;
  isVerified: boolean;
  permissions?: string[];
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  date: Date;
  startTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';
  paymentId?: string;
  meetingLink?: string;
  notes?: string;
  recordingUrl?: string;
  joinedAt?: Date;
  leftAt?: Date;
  mentorJoinedAt?: Date;
  mentorLeftAt?: Date;
  cancellationReason?: string;
  cancellationTime?: Date;
  cancellationBy?: string;
  feedback?: {
    rating: number;
    review: string;
    createdAt: Date;
  };
  verificationCode: string;
  isVerified: boolean;
  screenshots?: Array<{
    url: string;
    timestamp: Date;
  }>;
  activityLog: Array<{
    action: 'join' | 'leave' | 'screen_share' | 'chat' | 'verification';
    userId: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>;
}

export interface Mentor {
  userId: string;
  title: string;
  company: string;
  expertise: string[];
  experience: number;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  about: string;
  hourlyRate: number;
  languages: string[];
  rating: number;
  totalReviews: number;
  availability: Array<{
    day: string;
    slots: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>;
  isApproved: boolean;
}

export interface ApiError extends Error {
  statusCode: number;
  status: string;
  errors?: any[];
  isOperational: boolean;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}