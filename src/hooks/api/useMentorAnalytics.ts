import { useQuery } from '@tanstack/react-query';
import { getMentorAnalytics } from '@/lib/api/mentor';

export function useMentorAnalytics() {
  return useQuery({
    queryKey: ['mentor-analytics'],
    queryFn: getMentorAnalytics
  });
}