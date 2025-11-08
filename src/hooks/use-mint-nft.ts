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

  const mintOGNFT = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
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
        return;
      }

      setTxHash(result.txHash || null);
      toast.success('OG NFT minted successfully! 🎉');
      return result.txHash;
    } catch (error) {
      console.error('OG NFT minting error:', error);
      toast.error('NFT minting failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mintClaimerNFT = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!user?.fid) {
      toast.error('Farcaster account required');
      return;
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
        return;
      }

      setTxHash(result.txHash || null);
      toast.success('Claimer NFT minted successfully! 🎉');
      return result.txHash;
    } catch (error) {
      console.error('Claimer NFT minting error:', error);
      toast.error('NFT minting failed. Please try again.');
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

