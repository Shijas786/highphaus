import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
import { WALLETCONNECT_PROJECT_ID } from './constants';

// Configure chains and transports
export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'Base ETH Faucet',
        description: 'Claim free ETH on Base Network',
        url: 'https://base-faucet.example.com',
        icons: ['https://base.org/favicon.ico'],
      },
      showQrModal: false,
    }),
    coinbaseWallet({
      appName: 'Base ETH Faucet',
      appLogoUrl: 'https://base.org/favicon.ico',
    }),
  ],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
