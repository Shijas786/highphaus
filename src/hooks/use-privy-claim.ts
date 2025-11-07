'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useFarcasterContext } from './use-farcaster-context';
import { toast } from 'sonner';
import { IS_MOCK_MODE, FAUCET_CONTRACT_ADDRESS } from '@/config/constants';

export function usePrivyClaim() {
  const { ready, authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();
  const farcasterContext = useFarcasterContext();

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | undefined>();

  /**
   * Determine claim type: Farcaster FID or Base App
   */
  const getClaimType = () => {
    // Check if user has Farcaster account linked
    if (user?.farcaster?.fid) {
      return { type: 'farcaster', fid: user.farcaster.fid };
    }

    // Check if we're in a Farcaster Mini-App context
    if (farcasterContext.isFrameContext && farcasterContext.fid) {
      return { type: 'farcaster', fid: farcasterContext.fid };
    }

    // Otherwise, use Base App attestation
    const baseId = user?.id || wallets[0]?.address;
    return { type: 'baseapp', baseId };
  };

  /**
   * Claim via Farcaster FID
   */
  const claimFarcaster = async (_fid: number) => {
    if (!wallets[0]) {
      throw new Error('No wallet connected');
    }

    try {
      // Get provider from embedded wallet
      const provider = await wallets[0].getEthereumProvider();
      const { ethers } = await import('ethers');
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Import contract ABI
      const { FAUCET_ABI } = await import('@/config/constants');
      const faucet = new ethers.Contract(FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, signer);

      // Call claimFarcaster() on contract
      const tx = await faucet.claimFarcaster();
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error: any) {
      throw new Error(error.message || 'Farcaster claim failed');
    }
  };

  /**
   * Claim via Base App (requires backend attestation)
   */
  const claimBaseApp = async (baseId: string) => {
    if (!wallets[0]) {
      throw new Error('No wallet connected');
    }

    try {
      const walletAddress = wallets[0].address;

      // Get signature from backend
      const response = await fetch('/api/sign-attestation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: walletAddress,
          baseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get attestation signature');
      }

      const { signature } = await response.json();

      // Get provider and call contract
      const provider = await wallets[0].getEthereumProvider();
      const { ethers } = await import('ethers');
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      const { FAUCET_ABI } = await import('@/config/constants');
      const faucet = new ethers.Contract(FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, signer);

      // Call claimBaseApp() on contract
      const tx = await faucet.claimBaseApp(baseId, signature);
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error: any) {
      throw new Error(error.message || 'Base App claim failed');
    }
  };

  /**
   * Main claim function
   */
  const claim = async () => {
    if (!ready) {
      toast.error('Please wait for authentication to initialize');
      return;
    }

    if (!authenticated) {
      login();
      return;
    }

    if (!wallets[0]) {
      toast.error('No wallet available');
      return;
    }

    setIsLoading(true);

    try {
      if (IS_MOCK_MODE) {
        // Mock mode
        toast.loading('Preparing claim...', { id: 'claim' });
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockHash = `0x${Math.random().toString(16).slice(2)}...`;
        setTxHash(mockHash);
        toast.success('Claim successful! 🎉', { id: 'claim' });
        return;
      }

      // Determine claim type
      const claimInfo = getClaimType();

      toast.loading('Preparing claim...', { id: 'claim' });

      let hash: string;
      if (claimInfo.type === 'farcaster') {
        toast.loading('Claiming with Farcaster ID...', { id: 'claim' });
        hash = await claimFarcaster(claimInfo.fid!);
      } else {
        toast.loading('Claiming with Base App...', { id: 'claim' });
        hash = await claimBaseApp(claimInfo.baseId!);
      }

      setTxHash(hash);
      toast.success('Claim successful! 🎉', { id: 'claim' });

      // Log to backend
      try {
        await fetch('/api/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: wallets[0].address,
            txHash: hash,
            claimType: claimInfo.type,
            fid: claimInfo.type === 'farcaster' ? claimInfo.fid : undefined,
          }),
        });
      } catch (e) {
        console.error('Failed to log claim:', e);
      }
    } catch (error: any) {
      console.error('Claim error:', error);
      toast.error(error.message || 'Failed to claim', { id: 'claim' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claim,
    isLoading,
    txHash,
    ready,
    authenticated,
    user,
    walletAddress: wallets[0]?.address,
    claimType: authenticated ? getClaimType() : null,
    login,
  };
}
