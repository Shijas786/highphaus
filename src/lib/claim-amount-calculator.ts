import { parseUnits, formatUnits } from 'viem';

/**
 * Calculate the exact ETH amount needed to equal a target USD value
 * at the current ETH price
 */
export function calculateClaimAmountInWei(targetUsdValue: number, currentEthPrice: number): bigint {
  // Calculate ETH amount needed
  const ethAmount = targetUsdValue / currentEthPrice;

  // Convert to wei (18 decimals)
  return parseUnits(ethAmount.toFixed(18), 18);
}

/**
 * Calculate USD value of a given ETH amount (in wei)
 */
export function calculateUsdValue(ethAmountInWei: bigint, currentEthPrice: number): number {
  // Convert wei to ETH
  const ethAmount = parseFloat(formatUnits(ethAmountInWei, 18));

  // Calculate USD value
  return ethAmount * currentEthPrice;
}

/**
 * Format ETH amount for display
 */
export function formatEthAmount(ethAmountInWei: bigint): string {
  return formatUnits(ethAmountInWei, 18);
}

/**
 * Check if claim amount needs updating
 * Returns true if the current USD value deviates more than 10% from target
 */
export function shouldUpdateClaimAmount(
  currentClaimAmountInWei: bigint,
  targetUsdValue: number,
  currentEthPrice: number,
  tolerance: number = 0.1 // 10% tolerance
): boolean {
  const currentUsdValue = calculateUsdValue(currentClaimAmountInWei, currentEthPrice);
  const deviation = Math.abs(currentUsdValue - targetUsdValue) / targetUsdValue;

  return deviation > tolerance;
}

/**
 * Get recommended claim amount update
 */
export function getRecommendedClaimAmount(
  targetUsdValue: number = 0.1,
  currentEthPrice: number
): {
  ethAmount: string;
  weiAmount: bigint;
  usdValue: number;
  ethPrice: number;
} {
  const weiAmount = calculateClaimAmountInWei(targetUsdValue, currentEthPrice);
  const ethAmount = formatEthAmount(weiAmount);

  return {
    ethAmount,
    weiAmount,
    usdValue: targetUsdValue,
    ethPrice: currentEthPrice,
  };
}
