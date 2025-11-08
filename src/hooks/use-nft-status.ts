import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useFarcaster } from '@/components/FarcasterProvider';

interface NFTStatusData {
  ogNFT: {
    eligible: boolean;
    minted: boolean;
    contribution: string;
  };
  claimerNFT: {
    eligible: boolean;
    minted: boolean;
    hasClaimed: boolean;
  };
}

interface NFTStatusResponse {
  success: boolean;
  data?: NFTStatusData;
  error?: string;
}

async function fetchNFTStatus(address: string, fid: number): Promise<NFTStatusData> {
  const response = await fetch(`/api/nft-status?address=${address}&fid=${fid}`);
  const result: NFTStatusResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch NFT status');
  }

  return result.data;
}

export function useNFTStatus() {
  const { address } = useAccount();
  const { user } = useFarcaster();

  return useQuery({
    queryKey: ['nft-status', address, user?.fid],
    queryFn: () => fetchNFTStatus(address!, user!.fid),
    enabled: !!address && !!user?.fid,
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 10000,
  });
}

