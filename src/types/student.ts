export interface StudentProfile {
  userId: string;
  bio: string;
  interests: string[];
  learningGoals: string[];
  preferredLanguages: string[];
  education?: {
    level: string;
    institution: string;
    field: string;
    graduationYear: number;
  };
  socialLinks: Array<{
    platform: 'linkedin' | 'github' | 'twitter' | 'website';
    url: string;
  }>;
  notificationPreferences: {
    email: boolean;
    sessionReminders: boolean;
    marketingUpdates: boolean;
  };
}