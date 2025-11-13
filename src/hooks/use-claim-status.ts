import { useQuery } from '@tanstack/react-query';
import { useFarcaster } from '@/components/FarcasterProvider';
import { useAccount } from 'wagmi';

interface ClaimStatusData {
  canClaim: boolean;
  canClaimFarcaster: boolean;
  canClaimWallet: boolean;
  secondsUntilClaim: number;
  claimAmountWei: string;
  fid: number;
  farcasterIdHash: string;
}

interface ClaimStatusResponse {
  success: boolean;
  data?: ClaimStatusData;
  error?: string;
}

async function fetchClaimStatus(fid: number, address: string): Promise<ClaimStatusData> {
  const response = await fetch(`/api/claim-status?fid=${fid}&address=${address}`);
  const result: ClaimStatusResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch claim status');
  }

  return result.data;
}

export function useClaimStatus() {
  const { user } = useFarcaster();
  const { address } = useAccount();

  return useQuery({
    queryKey: ['claim-status', user?.fid, address],
    queryFn: () => fetchClaimStatus(user!.fid, address!),
    enabled: !!user?.fid && !!address,
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  });
}
