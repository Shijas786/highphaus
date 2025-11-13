import { Address } from 'viem';

export interface ClaimStatus {
  eligible: boolean;
  reason?: string;
  cooldownRemaining?: number;
  lastClaimTime?: number;
  canClaimAt?: number;
}

export interface ClaimStats {
  totalClaimed: string;
  totalClaimants: number;
  lastClaimTime: number;
  claimsPerMinute: number;
  contractBalance: string;
}

export interface ClaimHistoryItem {
  address: Address;
  amount: string;
  timestamp: number;
  txHash?: string;
}

export interface FaucetConfig {
  contractAddress: Address;
  claimAmount: string;
  cooldownMinutes: number;
  chainId: number;
}

export interface TransactionState {
  status: 'idle' | 'preparing' | 'signing' | 'pending' | 'success' | 'error';
  txHash?: string;
  error?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CONTRACT_ADDRESS?: string;
      NEXT_PUBLIC_BASE_RPC: string;
      NEXT_PUBLIC_BASE_SEPOLIA_RPC: string;
      NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS: string;
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_MOCK_MODE: string;
      NEXT_PUBLIC_CLAIM_COOLDOWN_MINUTES: string;
      NEXT_PUBLIC_CLAIM_AMOUNT_ETH: string;
      FAUCET_ADMIN_SECRET: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
