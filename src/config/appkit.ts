import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

if (!projectId) {
  console.warn('⚠️ NEXT_PUBLIC_REOWN_PROJECT_ID not set');
}

// Networks configuration
const networks = [base, baseSepolia];

// Create WagmiAdapter with SSR support (synchronous - works on mobile)
export const wagmiAdapter = new WagmiAdapter({
  networks: networks as [typeof base, typeof baseSepolia],
  projectId,
  ssr: true, // SSR support - adapter handles this safely
});

// Get wagmi config (synchronous - always available)
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Export config for backward compatibility
export const config = wagmiConfig;

let appKitInitialized = false;

/**
 * Initialize AppKit (client-side only, delayed for Farcaster webview)
 */
export function initializeAppKit() {
  if (typeof window === 'undefined') return; // Skip SSR
  if (appKitInitialized) return; // Already initialized

  try {
    createAppKit({
      adapters: [wagmiAdapter],
      networks: networks as [typeof base, typeof baseSepolia],
      projectId,
      metadata: {
        name: 'HighpHaus Faucet',
        description: 'Claim free ETH on Base Network with Farcaster',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://highp-haus.vercel.app',
        icons: [typeof window !== 'undefined' ? `${window.location.origin}/icon.png` : 'https://highp-haus.vercel.app/icon.png'],
      },
      features: {
        analytics: true,
        socials: ['farcaster', 'google', 'x', 'github', 'discord', 'apple'],
        email: true,
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

// Export networks for convenience
export { networks };

// Wagmi type declaration
declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
