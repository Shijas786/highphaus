'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI } from '@/config/constants';

export function useFarcasterClaim() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const claim = async (): Promise<`0x${string}` | undefined> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      return undefined;
    }

    setIsLoading(true);
    toast.loading('Preparing claim...', { id: 'claim' });

    try {
      // Call claimFarcaster() on contract
      const hash = await writeContractAsync({
        address: FAUCET_CONTRACT_ADDRESS,
        abi: FAUCET_ABI,
        functionName: 'claimFarcaster',
      });

      setTxHash(hash);
      toast.loading('Confirming transaction...', { id: 'claim' });

      // Wait for confirmation
      toast.success('Claim successful! 🎉', { id: 'claim' });

      return hash;
    } catch (error: any) {
      console.error('Claim error:', error);
      const errorMessage = error?.message || 'Failed to claim';

      if (errorMessage.includes('no Farcaster account')) {
        toast.error('No Farcaster account found for this wallet', { id: 'claim' });
      } else if (errorMessage.includes('already claimed')) {
        toast.error('This Farcaster ID already claimed', { id: 'claim' });
      } else if (errorMessage.includes('faucet empty')) {
        toast.error('Faucet is empty. Please try again later.', { id: 'claim' });
      } else {
        toast.error(errorMessage, { id: 'claim' });
      }
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claim,
    isLoading: isLoading || isConfirming,
    txHash,
    isConfirmed,
    isConnected,
    address,
  };
}
