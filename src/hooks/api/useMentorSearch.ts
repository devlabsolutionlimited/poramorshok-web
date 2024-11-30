import { useQuery } from '@tanstack/react-query';
import { searchMentors } from '@/lib/api/mentors';
import type { MentorSearchFilters } from '@/types/mentor';

export function useMentorSearch(filters?: MentorSearchFilters) {
  return useQuery({
    queryKey: ['mentors', filters],
    queryFn: () => searchMentors(filters),
    select: (data) => ({
      mentors: data.mentors || [],
      total: data.total || 0
    })
  });
}