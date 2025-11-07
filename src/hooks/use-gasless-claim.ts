'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { encodeFunctionData } from 'viem';
import { base } from 'viem/chains';
import { FAUCET_CONTRACT_ADDRESS, IS_MOCK_MODE } from '@/config/constants';
import {
  createPimlicoPublicClient,
  createPimlicoBundlerClient,
  createUserSmartAccount,
  createPimlicoSmartAccountClient,
  generateUserPrivateKey,
  PIMLICO_API_KEY,
} from '@/lib/pimlico-client';
import { sleep } from '@/lib/utils';

export function useGaslessClaim() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const address = wallets[0]?.address as `0x${string}` | undefined;
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | undefined>();

  /**
   * Check if Pimlico is properly configured
   */
  const isPimlicoConfigured = Boolean(PIMLICO_API_KEY);

  /**
   * Perform a gasless claim using Pimlico and account abstraction
   */
  const claim = async () => {
    if (!authenticated) {
      toast.error('Please login first');
      return;
    }

    if (!address) {
      toast.error('No wallet available');
      return;
    }

    if (!isPimlicoConfigured) {
      toast.error('Gasless transactions are not configured');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      if (IS_MOCK_MODE) {
        // Mock mode for testing
        toast.loading('Preparing gasless transaction...', { id: 'gasless-claim' });
        await sleep(1500);

        toast.loading('Creating smart account...', { id: 'gasless-claim' });
        await sleep(1000);

        toast.loading('Sending user operation...', { id: 'gasless-claim' });
        await sleep(2000);

        const mockHash = `0x${Math.random().toString(16).slice(2)}${Math.random()
          .toString(16)
          .slice(2)}${Math.random().toString(16).slice(2)}${Math.random()
          .toString(16)
          .slice(2)}` as `0x${string}`;

        setTxHash(mockHash);
        toast.success('Gasless claim successful! 🎉', { id: 'gasless-claim' });

        // Log claim to backend
        try {
          await fetch('/api/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address,
              txHash: mockHash,
              claimType: 'gasless',
            }),
          });
        } catch (e) {
          console.error('Failed to log claim:', e);
        }

        return;
      }

      // Real gasless claim flow
      toast.loading('Setting up smart account...', { id: 'gasless-claim' });

      // Generate a deterministic private key for this user
      // In production, consider using a more secure method
      const userPrivateKey = generateUserPrivateKey(address);

      // Create clients
      const publicClient = createPimlicoPublicClient(base);
      const pimlicoClient = createPimlicoBundlerClient(base);

      // Create smart account
      toast.loading('Creating smart account...', { id: 'gasless-claim' });
      const account = await createUserSmartAccount(userPrivateKey, publicClient);
      setSmartAccountAddress(account.address);

      // Create smart account client
      const smartAccountClient = await createPimlicoSmartAccountClient(
        account,
        base,
        pimlicoClient
      );

      // Encode the claim function call
      // Using simple function signature encoding
      const callData = encodeFunctionData({
        abi: [
          {
            inputs: [],
            name: 'claimFarcaster',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'claimFarcaster',
        args: [],
      });

      // Send the gasless transaction
      toast.loading('Sending gasless transaction...', { id: 'gasless-claim' });

      const hash = await smartAccountClient.sendTransaction({
        calls: [
          {
            to: FAUCET_CONTRACT_ADDRESS,
            data: callData,
            value: 0n,
          },
        ],
      });

      setTxHash(hash);
      toast.loading('Confirming transaction...', { id: 'gasless-claim' });

      // Wait a bit for the transaction to be processed
      await sleep(3000);

      toast.success('Gasless claim successful! 🎉', { id: 'gasless-claim' });

      // Log claim to backend
      try {
        await fetch('/api/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            txHash: hash,
            claimType: 'gasless',
            smartAccountAddress: account.address,
          }),
        });

        // Notify eligibility endpoint
        await fetch('/api/eligibility', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });
      } catch (e) {
        console.error('Failed to log claim:', e);
      }
    } catch (err: unknown) {
      console.error('Gasless claim error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process gasless claim. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'gasless-claim' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claim,
    isLoading,
    txHash,
    error,
    smartAccountAddress,
    isPimlicoConfigured,
  };
}
