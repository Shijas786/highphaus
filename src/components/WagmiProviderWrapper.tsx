'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ReactNode, useState, useEffect } from 'react';

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

if (!projectId) {
  console.warn('⚠️ NEXT_PUBLIC_REOWN_PROJECT_ID not set');
}

// Create QueryClient
const queryClient = new QueryClient();

// Setup wagmi adapter - lazy initialization for Farcaster webview compatibility
let wagmiAdapter: WagmiAdapter | null = null;
let appKitInitialized = false;

function initializeWagmi() {
  if (typeof window === 'undefined') return null; // Skip SSR
  if (wagmiAdapter) return wagmiAdapter; // Already initialized

  try {
    const networks = [base, baseSepolia];
    
    wagmiAdapter = new WagmiAdapter({
      networks,
      projectId,
      ssr: true,
    });

    // Initialize AppKit only once and only on client
    if (!appKitInitialized) {
      createAppKit({
        adapters: [wagmiAdapter],
        networks: [base, baseSepolia],
        projectId,
        metadata: {
          name: 'HighpHaus Faucet',
          description: 'Claim free ETH on Base Network with Farcaster',
          url: 'https://highphaus.vercel.app',
          icons: ['https://highphaus.vercel.app/icon.png'],
        },
        features: {
          analytics: true,
        },
        themeMode: 'dark',
        themeVariables: {
          '--w3m-accent': '#0052FF',
          '--w3m-border-radius-master': '4px',
        },
      });
      appKitInitialized = true;
    }

    return wagmiAdapter;
  } catch (error) {
    console.error('Failed to initialize Wagmi:', error);
    return null;
  }
}

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [adapter, setAdapter] = useState<WagmiAdapter | null>(null);

  // Initialize wallet providers after hydration (critical for Farcaster webview)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Wait for window to be fully available
    const init = () => {
      const initializedAdapter = initializeWagmi();
      if (initializedAdapter) {
        setAdapter(initializedAdapter);
      }
      setMounted(true);
    };

    // Small delay to ensure window is ready (especially for Farcaster webview)
    if (document.readyState === 'complete') {
      init();
    } else {
      window.addEventListener('load', init);
      return () => window.removeEventListener('load', init);
    }
  }, []);

  // During SSR or before mount, just provide QueryClient
  if (!mounted || !adapter) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  try {
    // Wagmi supports SSR with ssr: true, so always provide WagmiProvider
    return (
      <WagmiProvider config={adapter.wagmiConfig}>
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
