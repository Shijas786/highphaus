'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ReactNode, useEffect } from 'react';
import { wagmiConfig, initializeAppKit } from '@/config/appkit';

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

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  // Initialize AppKit after hydration (critical for Farcaster webview)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize immediately on mount
    initializeAppKit();
  }, []);

  // Always provide WagmiProvider during SSR and client (adapter supports SSR)
  // Only AppKit initialization is delayed for Farcaster webview compatibility
  try {
    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.error('WagmiProvider initialization error:', error);
    // If Wagmi fails, still provide QueryClient at minimum
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
}
