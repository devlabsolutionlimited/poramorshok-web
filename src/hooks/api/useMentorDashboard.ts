import { useQuery } from '@tanstack/react-query';
import { getMentorDashboard } from '@/lib/api/mentors';

export function useMentorDashboard() {
  return useQuery({
    queryKey: ['mentor-dashboard'],
    queryFn: getMentorDashboard,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
}