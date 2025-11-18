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
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    async function init() {
      try {
        // Set timeout to prevent infinite loading on mobile
        timeoutId = setTimeout(() => {
          if (!cancelled && !wagmiConfig) {
            console.warn('Wagmi config init timeout - rendering without WagmiProvider');
            setInitError('Initialization timeout');
          }
        }, 5000); // 5 second timeout

        // Dynamically import ONLY on client
        const appkit = await import('@/config/appkit');
        
        // Create wagmi config on client only (NOT on import)
        const config = appkit.createWagmiConfig();

        if (!cancelled) {
          clearTimeout(timeoutId);
          setWagmiConfig(config);

          // Now safely initialize AppKit AFTER wagmi is set
          appkit.initializeAppKit();
        }
      } catch (err) {
        console.error('Wagmi/AppKit init failed:', err);
        if (!cancelled) {
          clearTimeout(timeoutId);
          setInitError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    }

    init();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // If error or timeout, render children anyway (they'll handle missing wagmi gracefully)
  if (initError) {
    console.warn('Rendering without WagmiProvider due to init error:', initError);
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  // Before config loads → show loading, don't render children (they use wagmi hooks)
  if (!wagmiConfig) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-screen flex items-center justify-center" style={{ background: '#FFFFFF', color: '#000000' }}>
          <div className="text-center">
            <div className="text-lg mb-2">Loading...</div>
            <div className="text-sm opacity-60">Initializing wallet connection</div>
          </div>
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
