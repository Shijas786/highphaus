import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Configure chains and transports
export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
  },
  ssr: true,
});

// Export as wagmiConfig for compatibility
export const wagmiConfig = config;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
