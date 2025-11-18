'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, type Config } from 'wagmi';
import { ReactNode, useEffect, useState } from 'react';

/**
 * IMPORTANT:
 * We DO NOT import wagmiConfig or AppKit at the top.
 * They MUST be loaded inside useEffect or lazy-init to avoid Warpcast crashes.
 */

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
  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Dynamically import ONLY on client
        const appkit = await import('@/config/appkit');
        
        // Create wagmi config on client only (NOT on import)
        const config = appkit.createWagmiConfig();

        if (!cancelled) {
          setWagmiConfig(config);

          // Now safely initialize AppKit AFTER wagmi is set
          appkit.initializeAppKit();
        }
      } catch (err) {
        console.error('Wagmi/AppKit init failed:', err);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Before config loads → show loading, don't render children (they use wagmi hooks)
  if (!wagmiConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-screen flex items-center justify-center text-black">
          <div>Loading...</div>
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
