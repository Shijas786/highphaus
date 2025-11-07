'use client';

import { useState } from 'react';
import { useAccount, useWalletClient, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'sonner';
import { Token } from '@/config/tokens';
import { FAUCET_CONTRACT_ADDRESS } from '@/config/constants';

export function useDonate() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { sendTransactionAsync } = useSendTransaction();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Donate ETH (native currency)
   */
  const donateEth = async (amountEth: string): Promise<`0x${string}` | undefined> => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setError(undefined);
      setIsSuccess(false);
      setIsLoading(true);

      toast.loading('Preparing contribution...', { id: 'donate' });

      const amount = parseUnits(amountEth, 18);

      // Send ETH transaction
      const hash = await sendTransactionAsync({
        to: FAUCET_CONTRACT_ADDRESS,
        value: amount,
      });

      setTxHash(hash);
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
    if (!address || !isConnected || !walletClient) {
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

      // Encode transfer function call: transfer(address to, uint256 amount)
      const transferData = `0xa9059cbb${FAUCET_CONTRACT_ADDRESS.slice(2).padStart(
        64,
        '0'
      )}${amount.toString(16).padStart(64, '0')}`;

      // Send token transfer transaction
      const hash = await sendTransactionAsync({
        to: token.address,
        data: transferData as `0x${string}`,
      });

      setTxHash(hash);
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
