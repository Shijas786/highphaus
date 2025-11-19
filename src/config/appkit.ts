import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from 'wagmi';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

if (!projectId) {
  console.warn('⚠️ NEXT_PUBLIC_REOWN_PROJECT_ID not set');
}

import { type AppKitNetwork } from '@reown/appkit/networks';

// Networks configuration
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base, baseSepolia];

// Create WagmiAdapter with SSR support (synchronous - works on mobile)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  networks: networks as [typeof base, typeof baseSepolia],
  projectId,
  ssr: true, // SSR support - adapter handles this safely
});

// Get wagmi config (synchronous - always available)
export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Export config for backward compatibility
export const config = wagmiConfig;

// Wagmi type declaration
declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
