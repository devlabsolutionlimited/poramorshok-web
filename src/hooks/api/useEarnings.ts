import { useQuery } from '@tanstack/react-query';
import { getEarnings, getEarningStats } from '@/lib/api/payments';

export function useEarnings() {
  const earningsQuery = useQuery({
    queryKey: ['earnings'],
    queryFn: getEarnings
  });

  const statsQuery = useQuery({
    queryKey: ['earning-stats'],
    queryFn: getEarningStats
  });

  return {
    earnings: earningsQuery.data,
    stats: statsQuery.data,
    isLoading: earningsQuery.isLoading || statsQuery.isLoading,
    error: earningsQuery.error || statsQuery.error
  };
}