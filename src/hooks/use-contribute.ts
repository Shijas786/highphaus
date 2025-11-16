import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { parseAbi } from 'viem';
import { BASE_URL } from '@/config/constants';

const CONTRIBUTE_ABI = parseAbi([
  'function contribute() payable',
]);

export function useContribute() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const contribute = async (amountEth: string): Promise<string | undefined> => {
    if (!address) {
      toast.error('Please connect your wallet');
      return undefined;
    }

    const amountNum = parseFloat(amountEth);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
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

      // Contribute ETH to contract
      toast.info('Contributing ETH...');
      
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: CONTRIBUTE_ABI,
        functionName: 'contribute',
        value: parseEther(amountEth),
      });

      setTxHash(hash);
      toast.info('Waiting for confirmation...');

      // Log contribution on server
      await fetch(`${BASE_URL}/api/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          txHash: hash,
        }),
      });

      toast.success('Contribution successful! 🎉 Thank you for supporting builders!');
      return hash;
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
