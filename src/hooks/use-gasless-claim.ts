import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { useFarcaster } from '@/components/FarcasterProvider';
import { toast } from 'sonner';
import { parseAbi } from 'viem';

const CLAIM_ABI = parseAbi([
  'function claim(bytes32 farcasterIdHash, uint256 expiry, bytes signature)',
]);

interface ClaimSignatureResponse {
  success: boolean;
  farcasterIdHash?: string;
  expiry?: number;
  signature?: string;
  error?: string;
  secondsUntilClaim?: number;
}

export function useGaslessClaim() {
  const { address } = useAccount();
  const { user } = useFarcaster();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { writeContractAsync } = useWriteContract();

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
      // Step 1: Get attestation signature from server
      toast.info('Getting claim signature...');
      
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          fid: user.fid,
        }),
      });

      const result: ClaimSignatureResponse = await response.json();

      if (!result.success) {
        if (result.secondsUntilClaim) {
          const days = Math.floor(result.secondsUntilClaim / 86400);
          const hours = Math.floor((result.secondsUntilClaim % 86400) / 3600);
          const minutes = Math.floor((result.secondsUntilClaim % 3600) / 60);
          toast.error(`Cannot claim yet. Wait ${days}d ${hours}h ${minutes}m`);
        } else {
          toast.error(result.error || 'Claim failed');
        }
        setIsLoading(false);
        return;
      }

      // Step 2: User submits transaction (user pays gas)
      toast.info('Please confirm transaction in your wallet...');

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
      
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: CLAIM_ABI,
        functionName: 'claim',
        args: [result.farcasterIdHash as `0x${string}`, BigInt(result.expiry!), result.signature as `0x${string}`],
      });

      setTxHash(hash);
      toast.success('Transaction submitted! Waiting for confirmation...');

      // Wait for confirmation
      setIsConfirmed(true);
      toast.success('Claim successful! 🎉');
    } catch (error) {
      console.error('Claim error:', error);
      toast.error('Claim failed. Please try again.');
      setIsConfirmed(false);
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
