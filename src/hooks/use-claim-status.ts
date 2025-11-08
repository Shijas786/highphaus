import { useQuery } from '@tanstack/react-query';
import { useFarcaster } from '@/components/FarcasterProvider';

interface ClaimStatusData {
  canClaim: boolean;
  nextClaimTime: number;
  secondsUntilClaim: number;
  hasClaimed: boolean;
  fid: number;
}

interface ClaimStatusResponse {
  success: boolean;
  data?: ClaimStatusData;
  error?: string;
}

async function fetchClaimStatus(fid: number): Promise<ClaimStatusData> {
  const response = await fetch(`/api/claim-status?fid=${fid}`);
  const result: ClaimStatusResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch claim status');
  }

  return result.data;
}

export function useClaimStatus() {
  const { user } = useFarcaster();

  return useQuery({
    queryKey: ['claim-status', user?.fid],
    queryFn: () => fetchClaimStatus(user!.fid),
    enabled: !!user?.fid,
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  });
}

