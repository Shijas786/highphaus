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
    async function loadFarcasterContext() {
      try {
        // Check if we're in a Farcaster miniapp
        const inMiniapp = isFarcasterMiniapp();
        setIsMiniapp(inMiniapp);

        if (inMiniapp) {
          // Initialize SDK and get user context
          const context = await initializeFarcasterSDK();

          if (context?.user) {
            setUser({
              fid: context.user.fid,
              username: context.user.username,
              displayName: context.user.displayName,
              pfpUrl: context.user.pfpUrl,
            });
          }
        }
      } catch (error) {
        // Silently fail - app should still work without Farcaster context
      } finally {
        // Always set loading to false so app doesn't hang
        setIsLoading(false);
      }
    }

    loadFarcasterContext();
  }, []);

  return (
    <FarcasterContext.Provider value={{ user, isLoading, isMiniapp }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  return useContext(FarcasterContext);
}
