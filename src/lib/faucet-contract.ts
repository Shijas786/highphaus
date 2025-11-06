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
 * Get claim function configuration
 */
export function getClaimConfig(account: Address) {
  return {
    ...faucetContract,
    functionName: 'claim',
    account,
  } as const;
}

/**
 * Get canClaim check configuration
 */
export function getCanClaimConfig(userAddress: Address) {
  return {
    ...faucetContract,
    functionName: 'canClaim',
    args: [userAddress],
  } as const;
}

/**
 * Get last claim time configuration
 */
export function getLastClaimTimeConfig(userAddress: Address) {
  return {
    ...faucetContract,
    functionName: 'lastClaimTime',
    args: [userAddress],
  } as const;
}

/**
 * Get claim amount configuration
 */
export function getClaimAmountConfig() {
  return {
    ...faucetContract,
    functionName: 'claimAmount',
  } as const;
}

/**
 * Get cooldown time configuration
 */
export function getCooldownTimeConfig() {
  return {
    ...faucetContract,
    functionName: 'cooldownTime',
  } as const;
}

/**
 * Parse claim amount to ETH
 */
export function parseClaimAmount(amount: string) {
  return parseEther(amount);
}

/**
 * Faucet contract event types
 */
export type ClaimedEvent = {
  recipient: Address;
  amount: bigint;
  timestamp: bigint;
};


