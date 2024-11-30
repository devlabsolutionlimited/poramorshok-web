import { useQuery } from '@tanstack/react-query';
import { getMentorDashboard } from '@/lib/api/mentor';

export function useMentorDashboard() {
  return useQuery({
    queryKey: ['mentor-dashboard'],
    queryFn: getMentorDashboard
  });
}