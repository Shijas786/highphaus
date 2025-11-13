'use client';

import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wagmi';
import { ReactNode } from 'react';

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}


