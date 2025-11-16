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

// Setup wagmi adapter - initialize synchronously for SSR, but delay AppKit initialization
const networks = [base, baseSepolia];

// Initialize adapter synchronously (supports SSR with ssr: true)
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// Track AppKit initialization separately (only on client)
let appKitInitialized = false;

function initializeAppKit() {
  if (typeof window === 'undefined') return; // Skip SSR
  if (appKitInitialized) return; // Already initialized

  try {
    // Initialize AppKit only on client side (critical for Farcaster webview)
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
  } catch (error) {
    console.error('Failed to initialize AppKit:', error);
  }
}

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Initialize AppKit after hydration (critical for Farcaster webview)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Wait for window to be fully available
    const init = () => {
      initializeAppKit();
      setMounted(true);
    };

    // Small delay to ensure window is ready (especially for Farcaster webview)
    if (document.readyState === 'complete') {
      init();
      return;
    }
    
    window.addEventListener('load', init);
    return () => window.removeEventListener('load', init);
  }, []);

  // Always provide WagmiProvider during SSR and client (adapter supports SSR)
  // Only AppKit initialization is delayed for Farcaster webview compatibility
  try {
    return (
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
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
