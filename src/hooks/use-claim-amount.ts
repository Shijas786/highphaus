'use client';

import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { getClaimAmountConfig } from '@/lib/faucet-contract';
import { useEthPrice } from './use-eth-price';
import { IS_MOCK_MODE } from '@/config/constants';

export function useClaimAmount() {
  const { data: ethPrice } = useEthPrice();

  // Read claim amount from contract
  const { data: claimAmountWei, isLoading } = useReadContract({
    ...getClaimAmountConfig(),
    query: {
      enabled: !IS_MOCK_MODE,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  // Convert wei to ETH
  const claimAmountEth = claimAmountWei ? formatUnits(claimAmountWei as bigint, 18) : '0.00004'; // Fallback or mock value

  // Calculate current USD value
  const claimAmountUsd = ethPrice ? (parseFloat(claimAmountEth) * ethPrice).toFixed(4) : '0.10';

  // Check if it's close to $0.10 target
  const targetUsd = 0.1;
  const deviation = ethPrice ? Math.abs(parseFloat(claimAmountUsd) - targetUsd) / targetUsd : 0;

  const needsUpdate = deviation > 0.1; // More than 10% deviation

  return {
    claimAmountWei: claimAmountWei?.toString() || '40000000000000', // fallback
    claimAmountEth,
    claimAmountUsd,
    ethPrice,
    needsUpdate,
    deviation: (deviation * 100).toFixed(2) + '%',
    isLoading,
  };
}
