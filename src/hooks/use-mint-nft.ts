import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useFarcaster } from '@/components/FarcasterProvider';
import { toast } from 'sonner';

interface MintNFTResponse {
  success: boolean;
  txHash?: string;
  nftType?: string;
  error?: string;
}

export function useMintNFT() {
  const { address } = useAccount();
  const { user } = useFarcaster();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mintOGNFT = async (): Promise<string | undefined> => {
    if (!address) {
      toast.error('Please connect your wallet');
      return undefined;
    }

    setIsLoading(true);
    setTxHash(null);

    try {
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          nftType: 'og',
        }),
      });

      const result: MintNFTResponse = await response.json();

      if (!result.success) {
        toast.error(result.error || 'NFT minting failed');
        return undefined;
      }

      setTxHash(result.txHash || null);
      toast.success('OG NFT minted successfully! 🎉');
      return result.txHash;
    } catch (error) {
      console.error('OG NFT minting error:', error);
      toast.error('NFT minting failed. Please try again.');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const mintClaimerNFT = async (): Promise<string | undefined> => {
    if (!address) {
      toast.error('Please connect your wallet');
      return undefined;
    }

    if (!user?.fid) {
      toast.error('Farcaster account required');
      return undefined;
    }

    setIsLoading(true);
    setTxHash(null);

    try {
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          fid: user.fid,
          nftType: 'claimer',
        }),
      });

      const result: MintNFTResponse = await response.json();

      if (!result.success) {
        toast.error(result.error || 'NFT minting failed');
        return undefined;
      }

      setTxHash(result.txHash || null);
      toast.success('Claimer NFT minted successfully! 🎉');
      return result.txHash;
    } catch (error) {
      console.error('Claimer NFT minting error:', error);
      toast.error('NFT minting failed. Please try again.');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintOGNFT,
    mintClaimerNFT,
    isLoading,
    txHash,
  };
}

