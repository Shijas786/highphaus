import { Address } from 'viem';

/**
 * Supported tokens for donations on Base Network
 */
export interface Token {
  symbol: string;
  name: string;
  address?: Address; // undefined for native ETH
  decimals: number;
  icon: string; // emoji or icon identifier
  isNative?: boolean;
  coingeckoId?: string; // for price fetching
}

// Base Mainnet Token Addresses
export const BASE_TOKENS: Record<string, Token> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: 'Ξ',
    isNative: true,
    coingeckoId: 'ethereum',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address, // Base USDC
    decimals: 6,
    icon: '💵',
    coingeckoId: 'usd-coin',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' as Address, // Base USDT
    decimals: 6,
    icon: '💲',
    coingeckoId: 'tether',
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as Address, // Base DAI
    decimals: 18,
    icon: '◈',
    coingeckoId: 'dai',
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006' as Address, // Base WETH
    decimals: 18,
    icon: 'Ξ',
    coingeckoId: 'weth',
  },
};

// Base Sepolia Testnet Token Addresses (for testing)
export const BASE_SEPOLIA_TOKENS: Record<string, Token> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: 'Ξ',
    isNative: true,
  },
  // Add testnet token addresses here when needed
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address, // Base Sepolia USDC
    decimals: 6,
    icon: '💵',
  },
};

// ERC20 ABI for token operations
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Get supported tokens based on environment
 */
export function getSupportedTokens(isTestnet = false): Record<string, Token> {
  return isTestnet ? BASE_SEPOLIA_TOKENS : BASE_TOKENS;
}

/**
 * Get default donation tokens (most commonly used)
 */
export function getDefaultDonationTokens(isTestnet = false): Token[] {
  const tokens = getSupportedTokens(isTestnet);
  return [tokens.ETH, tokens.USDC, tokens.USDT, tokens.DAI].filter(Boolean);
}

/**
 * Convert token amount to USD value
 */
export function calculateUsdValue(
  tokenAmount: string,
  tokenPrice: number,
  _decimals: number
): number {
  const amount = parseFloat(tokenAmount);
  if (isNaN(amount) || amount <= 0) return 0;

  return amount * tokenPrice;
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(amount: string, decimals: number): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';

  // Show appropriate decimal places based on token
  if (decimals === 6) {
    return num.toFixed(2); // USDC, USDT - 2 decimals
  }
  return num.toFixed(4); // ETH, DAI - 4 decimals
}
