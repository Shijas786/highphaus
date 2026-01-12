'use client';

import { useQuery } from '@tanstack/react-query';

interface TokenPrices {
  [tokenSymbol: string]: number;
}

/**
 * Fetch multiple token prices from CoinGecko
 */
export function useTokenPrices(tokenIds: string[] = ['ethereum', 'usd-coin', 'tether', 'dai']) {
  return useQuery<TokenPrices>({
    queryKey: ['tokenPrices', tokenIds],
    queryFn: async () => {
      try {
        const ids = tokenIds.join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch token prices');
        }

        const data = await response.json();

        // Convert to our format
        const prices: TokenPrices = {
          ETH: data.ethereum?.usd || 2500,
          USDC: data['usd-coin']?.usd || 1,
          USDT: data.tether?.usd || 1,
          DAI: data.dai?.usd || 1,
          WETH: data.ethereum?.usd || 2500,
        };

        return prices;
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
        // Return fallback prices
        return {
          ETH: 2500,
          USDC: 1,
          USDT: 1,
          DAI: 1,
          WETH: 2500,
        };
      }
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Calculate USD value of a token amount
 */
export function calculateTokenUsdValue(
  amount: string,
  tokenSymbol: string,
  prices: TokenPrices | undefined
): number {
  if (!prices || !amount) return 0;

  const tokenAmount = parseFloat(amount);
  if (isNaN(tokenAmount)) return 0;

  const price = prices[tokenSymbol] || 0;
  return tokenAmount * price;
}
