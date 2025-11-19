'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FarcasterUser, initializeFarcasterSDK, isFarcasterMiniapp } from '@/lib/farcaster';
import { useConnect, useAccount } from 'wagmi';

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

  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    async function loadFarcasterContext() {
      // Set loading to false immediately to not block rendering
      setIsLoading(false);

      try {
        // Check if we're in a Farcaster miniapp
        const inMiniapp = isFarcasterMiniapp();
        setIsMiniapp(inMiniapp);

        if (inMiniapp) {
          try {
            // Initialize SDK and get user context
            // CRITICAL: initializeFarcasterSDK() will call sdk.actions.ready() to hide loading screen
            const context = await initializeFarcasterSDK();

            if (context?.user) {
              setUser({
                fid: context.user.fid,
                username: context.user.username,
                displayName: context.user.displayName,
                pfpUrl: context.user.pfpUrl,
              });
            }

            // Auto-connect if not connected
            if (!isConnected) {
              const injectedConnector = connectors.find(c => c.id === 'injected');
              if (injectedConnector) {
                connect({ connector: injectedConnector });
              }
            }
          } catch (sdkError) {
            // SDK initialization failed - but ready() should have been called
            console.warn('Farcaster SDK initialization failed (app will continue without it):', sdkError);
          }
        }
      } catch (error) {
        // Non-critical error - app should still render
        console.warn('Error loading Farcaster context (app will continue):', error);
      }
    }

    loadFarcasterContext();
  }, [connect, connectors, isConnected]);

  return (
    <FarcasterContext.Provider value={{ user, isLoading, isMiniapp }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  return useContext(FarcasterContext);
}
