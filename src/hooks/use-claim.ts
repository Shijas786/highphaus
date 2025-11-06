'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getClaimConfig } from '@/lib/faucet-contract';
import { toast } from 'sonner';
import { IS_MOCK_MODE } from '@/config/constants';
import { sleep } from '@/lib/utils';

export function useClaim() {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const claim = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setError(undefined);
      setIsSuccess(false);

      if (IS_MOCK_MODE) {
        // Mock mode for testing without real blockchain
        toast.loading('Preparing claim...', { id: 'claim' });
        await sleep(1000);

        toast.loading('Signing transaction...', { id: 'claim' });
        await sleep(1500);

        toast.loading('Confirming transaction...', { id: 'claim' });
        await sleep(2000);

        const mockHash = `0x${Math.random().toString(16).slice(2)}${Math.random()
          .toString(16)
          .slice(2)}${Math.random().toString(16).slice(2)}${Math.random()
          .toString(16)
          .slice(2)}` as `0x${string}`;

        setTxHash(mockHash);
        setIsSuccess(true);
        toast.success('Claim successful! 🎉', { id: 'claim' });

        // Mark wallet as having claimed (ONE-TIME ONLY)
        localStorage.setItem(`hasClaimed_${address}`, 'true');

        // Log claim to backend
        try {
          await fetch('/api/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, txHash: mockHash }),
          });
          
          // Also notify eligibility endpoint
          await fetch('/api/eligibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
          });
        } catch (e) {
          console.error('Failed to log claim:', e);
        }

        return;
      }

      // Real blockchain flow
      toast.loading('Preparing transaction...', { id: 'claim' });

      const hash = await writeContractAsync(getClaimConfig(address));

      setTxHash(hash);
      toast.loading('Waiting for confirmation...', { id: 'claim' });

      // Wait for transaction to be mined
      await sleep(2000); // Give some time for the transaction to be included

      setIsSuccess(true);
      toast.success('Claim successful! 🎉', { id: 'claim' });

      // Log claim to backend
      try {
        await fetch('/api/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, txHash: hash }),
        });
        
        // Also notify eligibility endpoint
        await fetch('/api/eligibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });
      } catch (e) {
        console.error('Failed to log claim:', e);
      }
    } catch (err: unknown) {
      console.error('Claim error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to claim. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'claim' });
    }
  };

  return {
    claim,
    isLoading: isConfirming,
    isSuccess,
    txHash,
    error,
  };
}


