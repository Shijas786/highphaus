'use client';

import { useEffect } from 'react';

/**
 * Farcaster Mini-App SDK Provider
 * Notifies Farcaster when the app is ready to display
 * Based on: https://miniapps.farcaster.xyz/docs/getting-started
 */
export function FarcasterFrameProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if we're running inside a Farcaster Mini-App
    const isInFrame = window.parent !== window;
    
    if (isInFrame) {
      // Dynamically import the Farcaster Mini-App SDK to avoid SSR issues
      import('@farcaster/miniapp-sdk').then(async ({ sdk }) => {
        // Notify Farcaster that the app is ready to display
        // This removes the splash screen
        await sdk.actions.ready();
        console.log('✅ Farcaster Mini-App SDK: App ready');
      }).catch((error) => {
        console.warn('Farcaster Mini-App SDK not available:', error);
        // Not a critical error - app still works outside Farcaster
      });
    }
  }, []);

  return <>{children}</>;
}

