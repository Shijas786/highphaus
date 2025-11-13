import { Address } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export const FAUCET_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address) ||
  '0x0000000000000000000000000000000000000000';

// Reown AppKit Project ID
export const REOWN_PROJECT_ID = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

// Claim amount in USD - we calculate ETH amount dynamically based on price
export const CLAIM_AMOUNT_USD = 0.03; // $0.03 worth of ETH

// 48-HOUR RECURRING CLAIMS
export const COOLDOWN_PERIOD = 48 * 60 * 60; // 48 hours in seconds

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Chain configurations
export const SUPPORTED_CHAINS = [base, baseSepolia];

export const DEFAULT_CHAIN = IS_MOCK_MODE ? baseSepolia : base;

// UI Constants
export const APP_NAME = 'Base ETH Faucet';
export const APP_DESCRIPTION = 'Claim free ETH on Base Network';

// Animation durations (ms)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Toast durations (ms)
export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 7000,
} as const;

// Contract ABI for BaseFarcasterFaucet
export const FAUCET_ABI = [
  {
    inputs: [],
    name: 'claimFarcaster',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWeiAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'fidClaimed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'idRegistry',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'priceFeed',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'fid', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'weiAmount', type: 'uint256' },
    ],
    name: 'ClaimedFarcaster',
    type: 'event',
  },
] as const;

// Mock data for development
export const MOCK_CLAIM_HISTORY = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as Address,
    amount: '0.01',
    timestamp: Date.now() - 1000 * 60 * 5,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  {
    address: '0x1234567890123456789012345678901234567890' as Address,
    amount: '0.01',
    timestamp: Date.now() - 1000 * 60 * 15,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
];

export const MOCK_STATS = {
  totalClaimed: '12.45',
  totalClaimants: 1245,
  lastClaimTime: Date.now() - 1000 * 60 * 2,
  claimsPerMinute: 0.5,
  contractBalance: '100.0',
};
