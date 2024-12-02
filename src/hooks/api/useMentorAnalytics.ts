import { useQuery } from '@tanstack/react-query';
import { getMentorAnalytics } from '@/lib/api/analytics';

export function useMentorAnalytics() {
  return useQuery({
    queryKey: ['mentor-analytics'],
    queryFn: getMentorAnalytics,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: 1000
  });
}