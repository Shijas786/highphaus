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
    console.log('🚀 FarcasterProvider useEffect RUNNING', new Date().toISOString());

    async function loadFarcasterContext() {
      console.log('📦 loadFarcasterContext() STARTED');
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
          } catch (sdkError) {
            // SDK initialization failed - but ready() should have been called
            console.warn('Farcaster SDK initialization failed (app will continue without it):', sdkError);
          }
        }

        // Auto-connect attempt (works both in miniapp AND normal browser)
        if (!isConnected) {
          console.log('🔌 Attempting auto-connect...');
          console.log('Available connectors:', connectors.map(c => `${c.id} (${c.name})`));

          // Try finding injected connector (Farcaster wallet or browser wallet)
          const injectedConnector = connectors.find(c => c.id === 'injected');

          if (injectedConnector) {
            console.log('✅ Found injected connector, connecting...');
            try {
              await connect({ connector: injectedConnector });
              console.log('✅ Auto-connect successful');
            } catch (connectError) {
              console.error('❌ Auto-connect failed:', connectError);
            }
          } else {
            console.warn('⚠️ No injected connector found. Available:', connectors.map(c => c.id));
            console.log('💡 User may need to manually connect wallet');
          }
        } else {
          console.log('✅ Already connected');
        }
      } catch (error) {
        // Non-critical error - app should still render
        console.warn('Error loading Farcaster context (app will continue):', error);
      }
    }

    loadFarcasterContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, connectors]); // Removed isConnected to prevent re-runs

  return (
    <FarcasterContext.Provider value={{ user, isLoading, isMiniapp }}>
      {children}
    </FarcasterContext.Provider>
  );
}

export function useFarcaster() {
  return useContext(FarcasterContext);
}
