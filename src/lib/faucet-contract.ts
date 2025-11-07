import { Address, parseEther } from 'viem';
import { FAUCET_ABI, FAUCET_CONTRACT_ADDRESS } from '@/config/constants';

/**
 * Faucet contract configuration and helpers
 */
export const faucetContract = {
  address: FAUCET_CONTRACT_ADDRESS,
  abi: FAUCET_ABI,
} as const;

/**
 * Get claim function configuration for Farcaster users
 */
export function getClaimConfig(account: Address) {
  return {
    ...faucetContract,
    functionName: 'claimFarcaster',
    account,
  } as const;
}

/**
 * Get fidClaimed check configuration
 */
export function getFidClaimedConfig(fid: number) {
  return {
    ...faucetContract,
    functionName: 'fidClaimed',
    args: [BigInt(fid)],
  } as const;
}

/**
 * Get Wei amount configuration (how much ETH to claim)
 */
export function getClaimAmountConfig() {
  return {
    ...faucetContract,
    functionName: 'getWeiAmount',
  } as const;
}

/**
 * Parse claim amount to ETH
 */
export function parseClaimAmount(amount: string) {
  return parseEther(amount);
}

/**
 * Farcaster Faucet event types
 */
export type ClaimedFarcasterEvent = {
  user: Address;
  fid: bigint;
  weiAmount: bigint;
};
