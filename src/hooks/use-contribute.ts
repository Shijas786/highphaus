import { useState } from 'react';
import { useAccount } from 'wagmi';
import { parseUSDC, USDC_ADDRESS } from '@/lib/faucet-contract';
import { toast } from 'sonner';
import { getPublicClient, getWalletClient } from '@wagmi/core';
import { wagmiConfig } from '@/config/wagmi';
import { parseAbi } from 'viem';

const USDC_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]);

export function useContribute() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const contribute = async (amount: string): Promise<string | undefined> => {
    if (!address) {
      toast.error('Please connect your wallet');
      return undefined;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 1) {
      toast.error('Minimum contribution is 1 USDC');
      return undefined;
    }

    setIsLoading(true);
    setTxHash(null);

    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
      if (!contractAddress) {
        toast.error('Contract address not configured');
        return undefined;
      }

      // Get wallet and public clients
      const walletClient = await getWalletClient(wagmiConfig, { account: address });
      const publicClient = getPublicClient(wagmiConfig);

      if (!walletClient || !publicClient) {
        toast.error('Failed to get wallet client');
        return undefined;
      }

      // Parse USDC amount (6 decimals)
      const usdcAmount = parseUSDC(amount);

      // Check allowance
      const currentAllowance = await publicClient.readContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: [address, contractAddress],
      });

      // Approve USDC if needed
      if (currentAllowance < usdcAmount) {
        toast.info('Approving USDC...');
        
        const approveTx = await walletClient.writeContract({
          address: USDC_ADDRESS as `0x${string}`,
          abi: USDC_ABI,
          functionName: 'approve',
          args: [contractAddress, usdcAmount],
        });

        toast.info('Waiting for approval confirmation...');
        await publicClient.waitForTransactionReceipt({ hash: approveTx });
        toast.success('USDC approved');
      }

      // Contribute to contract
      toast.info('Contributing USDC...');
      
      const contributeTx = await walletClient.writeContract({
        address: contractAddress,
        abi: parseAbi(['function contribute(uint256 amount)']),
        functionName: 'contribute',
        args: [usdcAmount],
      });

      toast.info('Waiting for contribution confirmation...');
      const receipt = await publicClient.waitForTransactionReceipt({ hash: contributeTx });
      
      setTxHash(receipt.transactionHash);

      // Log contribution on server
      await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          txHash: receipt.transactionHash,
        }),
      });

      toast.success('Contribution successful! 🎉');
      return receipt.transactionHash;
    } catch (error) {
      console.error('Contribution error:', error);
      toast.error('Contribution failed. Please try again.');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contribute,
    isLoading,
    txHash,
  };
}

