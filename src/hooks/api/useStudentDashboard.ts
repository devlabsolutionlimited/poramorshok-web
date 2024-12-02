import { useQuery } from '@tanstack/react-query';
import { getStudentDashboard } from '@/lib/api/student';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: getStudentDashboard,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: 1000
  });
}