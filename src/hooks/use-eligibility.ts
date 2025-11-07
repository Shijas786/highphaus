'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ClaimStatus } from '@/types';
import { IS_MOCK_MODE } from '@/config/constants';

export function useEligibility() {
  const { address, isConnected } = useAccount();

  return useQuery<ClaimStatus>({
    queryKey: ['eligibility', address],
    queryFn: async () => {
      if (!address) {
        return {
          eligible: false,
          reason: 'Wallet not connected',
        };
      }

      if (IS_MOCK_MODE) {
        // Mock eligibility check - ONE-TIME ONLY
        const hasClaimed = localStorage.getItem(`hasClaimed_${address}`) === 'true';

        if (hasClaimed) {
          return {
            eligible: false,
            reason: 'Already claimed - One claim per wallet only',
            hasClaimed: true,
          };
        }

        return {
          eligible: true,
          hasClaimed: false,
        };
      }

      // Real eligibility check via API
      try {
        const response = await fetch(`/api/eligibility?address=${address}`);
        if (!response.ok) {
          throw new Error('Failed to check eligibility');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Eligibility check error:', error);
        return {
          eligible: false,
          reason: 'Failed to check eligibility',
        };
      }
    },
    enabled: isConnected && !!address,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
