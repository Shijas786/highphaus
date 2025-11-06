'use client';

import { useEffect, createContext, useContext, useState } from 'react';

/**
 * Farcaster Mini-App SDK Provider
 * Notifies Farcaster when the app is ready to display
 * Based on: https://miniapps.farcaster.xyz/docs/getting-started
 */

interface FarcasterMiniAppContext {
  isInMiniApp: boolean;
  context?: any;
}

const FarcasterContext = createContext<FarcasterMiniAppContext>({
  isInMiniApp: false,
});

export const useFarcasterMiniApp = () => useContext(FarcasterContext);

export function FarcasterFrameProvider({ children }: { children: React.ReactNode }) {
  const [farcasterContext, setFarcasterContext] = useState<FarcasterMiniAppContext>({
    isInMiniApp: false,
  });

  useEffect(() => {
    // Check if we're running inside a Farcaster Mini-App
    const isInFrame = window.parent !== window;
    
    if (isInFrame) {
      // Dynamically import the Farcaster Mini-App SDK to avoid SSR issues
      import('@farcaster/miniapp-sdk').then(async ({ sdk }) => {
        // Get Mini-App context
        const context = await sdk.context;
        
        setFarcasterContext({
          isInMiniApp: true,
          context,
        });
        
        // Notify Farcaster that the app is ready to display
        // This removes the splash screen
        await sdk.actions.ready();
        console.log('✅ Farcaster Mini-App SDK: App ready', context);
      }).catch((error) => {
        console.warn('Farcaster Mini-App SDK not available:', error);
        // Not a critical error - app still works outside Farcaster
      });
    }
  }, []);

  return (
    <FarcasterContext.Provider value={farcasterContext}>
      {children}
    </FarcasterContext.Provider>
  );
}

