'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';
import { IS_MOCK_MODE } from '@/config/constants';

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmhni9xo30171l50cunm9361e';

  if (!appId || appId === 'cmhni9xo30171l50cunm9361e') {
    console.log('✅ Using Privy App ID:', appId);
  }

  // Detect if in Farcaster Mini-App (iframe)
  const isInMiniApp = typeof window !== 'undefined' && window.parent !== window;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Appearance
        appearance: {
          theme: 'light',
          accentColor: '#0052FF',
        },
        // Embedded wallets
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users', // Auto-create wallet for all users
          },
        },
        // Login methods - When in Mini-App, skip Farcaster SIWF (they're already in Farcaster!)
        // Just show wallet/email options
        loginMethods: isInMiniApp
          ? ['wallet', 'email'] // Skip redundant Farcaster auth in Mini-App
          : ['farcaster', 'wallet', 'email', 'sms'], // Show Farcaster for web
        // Supported chains
        defaultChain: IS_MOCK_MODE ? baseSepolia : base,
        supportedChains: [base, baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
