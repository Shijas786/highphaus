'use client';

import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { parseUnits, Address, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { toast } from 'sonner';
import { Token } from '@/config/tokens';
import { FAUCET_CONTRACT_ADDRESS } from '@/config/constants';

export function useDonate() {
  const { wallets } = useWallets();
  const address = wallets[0]?.address as Address | undefined;
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Donate ETH (native currency)
   */
  const donateEth = async (amountEth: string): Promise<`0x${string}` | undefined> => {
    if (!address || !wallets[0]) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setError(undefined);
      setIsSuccess(false);
      setIsLoading(true);

      toast.loading('Preparing contribution...', { id: 'donate' });

      const amount = parseUnits(amountEth, 18);

      // Get embedded wallet provider
      const provider = await wallets[0].getEthereumProvider();

      // Send transaction
      const hash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: FAUCET_CONTRACT_ADDRESS,
            value: `0x${amount.toString(16)}`,
          },
        ],
      })) as `0x${string}`;

      setTxHash(hash);
      toast.loading('Confirming transaction...', { id: 'donate' });

      // Wait for confirmation
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setIsSuccess(true);
      toast.success('Contribution successful! 🎉 OG NFT eligibility recorded', { id: 'donate' });

      // Record donation for NFT eligibility
      try {
        await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            txHash: hash,
            token: 'ETH',
            amount: amountEth,
          }),
        });
      } catch (e) {
        console.error('Failed to log donation:', e);
      }

      return hash;
    } catch (err: unknown) {
      console.error('Contribution error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'donate' });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Support with ERC20 token (USDC, USDT, DAI, etc)
   */
  const donateToken = async (
    token: Token,
    amountToken: string
  ): Promise<`0x${string}` | undefined> => {
    if (!address || !wallets[0]) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!token.address) {
      toast.error('Invalid token configuration');
      return;
    }

    try {
      setError(undefined);
      setIsSuccess(false);
      setIsLoading(true);

      toast.loading('Preparing contribution...', { id: 'donate' });

      const amount = parseUnits(amountToken, token.decimals);

      // Get embedded wallet provider
      const provider = await wallets[0].getEthereumProvider();

      // Encode transfer function call
      const transferData = `0xa9059cbb${FAUCET_CONTRACT_ADDRESS.slice(2).padStart(
        64,
        '0'
      )}${amount.toString(16).padStart(64, '0')}`;

      // Send transaction
      const hash = (await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: token.address,
            data: transferData,
          },
        ],
      })) as `0x${string}`;

      setTxHash(hash);
      toast.loading('Confirming transaction...', { id: 'donate' });

      // Wait for confirmation
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setIsSuccess(true);
      toast.success(`Contribution successful! 🎉 OG NFT eligibility recorded`, { id: 'donate' });

      // Record donation for NFT eligibility
      try {
        await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            txHash: hash,
            token: token.symbol,
            amount: amountToken,
          }),
        });
      } catch (e) {
        console.error('Failed to log donation:', e);
      }

      return hash;
    } catch (err: unknown) {
      console.error('Contribution error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'donate' });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Main support function - handles both ETH and ERC20
   */
  const donate = async (token: Token, amount: string) => {
    if (token.isNative) {
      return donateEth(amount);
    } else {
      return donateToken(token, amount);
    }
  };

  return {
    donate,
    donateEth,
    donateToken,
    isLoading,
    isSuccess,
    txHash,
    error,
  };
}
