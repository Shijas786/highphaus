import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useFarcaster } from '@/components/FarcasterProvider';
import { toast } from 'sonner';

interface ClaimResponse {
  success: boolean;
  txHash?: string;
  error?: string;
  secondsUntilClaim?: number;
}

export function useGaslessClaim() {
  const { address } = useAccount();
  const { user } = useFarcaster();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const claim = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!user?.fid) {
      toast.error('Farcaster account required');
      return;
    }

    setIsLoading(true);
    setIsConfirmed(false);
    setTxHash(null);

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          fid: user.fid,
        }),
      });

      const result: ClaimResponse = await response.json();

      if (!result.success) {
        if (result.secondsUntilClaim) {
          const hours = Math.floor(result.secondsUntilClaim / 3600);
          const minutes = Math.floor((result.secondsUntilClaim % 3600) / 60);
          toast.error(`Cannot claim yet. Wait ${hours}h ${minutes}m`);
        } else {
          toast.error(result.error || 'Claim failed');
        }
        return;
      }

      setTxHash(result.txHash || null);
      setIsConfirmed(true);
      toast.success('Claim successful! 🎉');
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Claim failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claim,
    isLoading,
    txHash,
    isConfirmed,
  };
}

