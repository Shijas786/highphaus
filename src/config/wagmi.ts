// Reown AppKit is now configured in WagmiProviderWrapper.tsx
// This file exports the config for backward compatibility

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base, baseSepolia } from '@reown/appkit/networks';

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

// Create wagmi adapter
const networks = [base, baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// Export config for backward compatibility
export const config = wagmiAdapter.wagmiConfig;
export const wagmiConfig = wagmiAdapter.wagmiConfig;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
