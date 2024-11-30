import api from '@/lib/api';
import type { Mentor, MentorSearchFilters } from '@/types/mentor';

export class MentorService {
  static async search(filters: MentorSearchFilters): Promise<Mentor[]> {
    const response = await api.get('/mentors', { params: filters });
    return response.data;
  }

  static async getById(id: string): Promise<Mentor> {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  }

  static async createProfile(data: Partial<Mentor>): Promise<Mentor> {
    const response = await api.post('/mentors/profile', data);
    return response.data;
  }

  static async updateProfile(data: Partial<Mentor>): Promise<Mentor> {
    const response = await api.put('/mentors/profile', data);
    return response.data;
  }
}