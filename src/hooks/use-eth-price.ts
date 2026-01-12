'use client';

import { useQuery } from '@tanstack/react-query';

export function useEthPrice() {
  return useQuery<number>({
    queryKey: ['eth-price'],
    queryFn: async () => {
      try {
        // Fetch real-time ETH price from CoinGecko
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch ETH price');
        }

        const data = await response.json();
        const price = data.ethereum?.usd;

        if (!price) {
          throw new Error('Invalid price data');
        }

        return price;
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        return 2500; // Fallback price if API fails
      }
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000,
  });
}

export function calculateEthFromUsd(usdAmount: number, ethPrice: number): string {
  const ethAmount = usdAmount / ethPrice;
  return ethAmount.toFixed(6);
}
