import axios from 'axios';
import type { Mentor, MentorSearchFilters } from '@/types/mentor';

export const searchMentors = async (filters: MentorSearchFilters): Promise<Mentor[]> => {
  try {
    const response = await axios.get('/mentors', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error('Failed to search mentors');
  }
};

export const getMentorById = async (id: string): Promise<Mentor> => {
  try {
    const response = await axios.get(`/mentors/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get mentor details');
  }
};

export const createMentorProfile = async (data: Partial<Mentor>): Promise<Mentor> => {
  try {
    const response = await axios.post('/mentors/profile', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create mentor profile');
  }
};

export const updateMentorProfile = async (data: Partial<Mentor>): Promise<Mentor> => {
  try {
    const response = await axios.put('/mentors/profile', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update mentor profile');
  }
};