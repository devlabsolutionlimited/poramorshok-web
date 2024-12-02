import api from '@/lib/http';

export interface Availability {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  startTime: string;
  endTime: string;
  sessionDuration: number;
  breakBetweenSessions: number;
}

export const getAvailability = async (): Promise<Availability> => {
  const response = await api.get('/api/mentor/availability');
  return response.data;
};

export const updateAvailability = async (data: Partial<Availability>): Promise<Availability> => {
  const response = await api.put('/api/mentor/availability', data);
  return response.data;
};