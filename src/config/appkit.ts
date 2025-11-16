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

// Create WagmiAdapter with SSR support
export const wagmiAdapter = new WagmiAdapter({
  networks: networks as [typeof base, typeof baseSepolia],
  projectId,
  ssr: true,
});

// Get wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Export config for backward compatibility
export const config = wagmiConfig;

// Wagmi type declaration
declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}

// Create AppKit (initialize on client only)
let appKitInitialized = false;

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

// Export networks for convenience
export { networks };

