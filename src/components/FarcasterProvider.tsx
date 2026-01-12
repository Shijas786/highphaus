'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FarcasterUser, initializeFarcasterSDK, isFarcasterMiniapp } from '@/lib/farcaster';

interface FarcasterContextType {
  user: FarcasterUser | null;
  isLoading: boolean;
  isMiniapp: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isLoading: true,
  isMiniapp: false,
});

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMiniapp, setIsMiniapp] = useState(false);

  useEffect(() => {
    console.log('🚀 FarcasterProvider initializing...');

    async function loadFarcasterContext() {
      // Set loading to false immediately to not block rendering
      setIsLoading(false);

      try {
        // Check if we're in a Farcaster miniapp
        const inMiniapp = isFarcasterMiniapp();
        setIsMiniapp(inMiniapp);

        if (inMiniapp) {
          console.log('✅ Running in Farcaster miniapp');
          try {
            // Initialize SDK and get user context
            // CRITICAL: initializeFarcasterSDK() will call sdk.actions.ready() to hide loading screen
            const context = await initializeFarcasterSDK();

            if (context?.user) {
              console.log('✅ Farcaster user loaded:', context.user.username);
              setUser({
                fid: context.user.fid,
                username: context.user.username,
                displayName: context.user.displayName,
                pfpUrl: context.user.pfpUrl,
              });
            }
          } catch (sdkError) {
            console.warn('Farcaster SDK initialization failed:', sdkError);
          }
        } else {
          console.log('ℹ️ Not in Farcaster miniapp - running in regular browser');
        }

        console.log('💡 Use Reown/WalletConnect button to connect wallet');
      } catch (error) {
        console.warn('Error loading Farcaster context:', error);
      }
    }

    loadFarcasterContext();
  }, []); // Run only once on mount

  return (
    <FarcasterContext.Provider value={{ user, isLoading, isMiniapp }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  return useContext(FarcasterContext);
}
