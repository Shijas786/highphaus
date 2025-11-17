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
let wagmiAdapter: WagmiAdapter | null = null;
let appKitInitialized = false;

/**
 * Create wagmi config on client only (NOT on import)
 * This prevents Warpcast crashes from early wallet initialization
 */
export function createWagmiConfig() {
  if (typeof window === 'undefined') {
    throw new Error('createWagmiConfig must be called on client side only');
  }

  // Create adapter if not already created
  if (!wagmiAdapter) {
    wagmiAdapter = new WagmiAdapter({
      networks: networks as [typeof base, typeof baseSepolia],
      projectId,
      ssr: false, // Client-side only
    });
  }

  return wagmiAdapter.wagmiConfig;
}

/**
 * Initialize AppKit AFTER wagmi config is ready
 * This prevents Warpcast crashes from early wallet initialization
 */
export function initializeAppKit() {
  if (typeof window === 'undefined') return; // Skip SSR
  if (appKitInitialized) return; // Already initialized
  if (!wagmiAdapter) {
    console.warn('WagmiAdapter not initialized. Call createWagmiConfig() first.');
    return;
  }

  try {
    createAppKit({
      adapters: [wagmiAdapter],
      networks: networks as [typeof base, typeof baseSepolia],
      projectId,
      metadata: {
        name: 'HighpHaus Faucet',
        description: 'Claim free ETH on Base Network with Farcaster',
        url: 'https://highp-haus.vercel.app',
        icons: ['https://highp-haus.vercel.app/icon.png'],
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

// Wagmi type declaration
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof createWagmiConfig>;
  }
}
