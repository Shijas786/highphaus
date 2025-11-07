'use client';

import { useQuery } from '@tanstack/react-query';
import { ClaimStats } from '@/types';
import { IS_MOCK_MODE, MOCK_STATS } from '@/config/constants';

export function useStats() {
  return useQuery<ClaimStats>({
    queryKey: ['faucet-stats'],
    queryFn: async () => {
      if (IS_MOCK_MODE) {
        // Return mock stats with some randomization
        return {
          ...MOCK_STATS,
          lastClaimTime: Date.now() - Math.random() * 1000 * 60 * 5,
          claimsPerMinute: Math.random() * 2,
        };
      }

      // Fetch real stats from API
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Stats fetch error:', error);
        // Return default stats on error
        return MOCK_STATS;
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
