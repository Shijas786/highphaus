import { Address } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'] as const;

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Missing environment variable: ${envVar}`);
  }
});

export const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID_HERE';

export const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || '';

export const FAUCET_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS as Address) ||
  '0x0000000000000000000000000000000000000000';

// Claim amount in USD - we calculate ETH amount dynamically based on price
export const CLAIM_AMOUNT_USD = 0.1; // $0.10 worth of ETH

// ONE-TIME CLAIM ONLY - No cooldown, each wallet can only claim once EVER
export const ONE_TIME_CLAIM_ONLY = true;

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

// Contract ABI for Faucet
export const FAUCET_ABI = [
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'canClaim',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'lastClaimTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cooldownTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'Claimed',
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
