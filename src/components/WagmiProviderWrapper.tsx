'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi';
import { ReactNode } from 'react';
import { wagmiAdapter, projectId, networks } from '@/config/appkit';
import { createAppKit } from '@reown/appkit/react';

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
      throwOnError: false,
    },
  },
});

// Initialize AppKit outside the component render cycle
if (!projectId) {
  console.error('AppKit Initialization Error: Project ID is missing.');
} else {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    metadata: {
      name: 'HighpHaus Faucet',
      description: 'Claim free ETH on Base Network with Farcaster',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://highp-haus.vercel.app',
      icons: [typeof window !== 'undefined' ? `${window.location.origin}/icon.png` : 'https://highp-haus.vercel.app/icon.png'],
    },
    features: {
      analytics: true,
      // Farcaster social login + WalletConnect/Reown
      socials: ['farcaster'],
      email: false,
    },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#0052FF',
      '--w3m-border-radius-master': '4px',
    },
  });
}

export function WagmiProviderWrapper({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
