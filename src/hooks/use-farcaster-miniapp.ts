'use client';

import { useEffect, useState } from 'react';

interface FarcasterMiniAppContext {
  isMiniApp: boolean;
  fid: number | null;
  username: string | null;
}

/**
 * Hook to use Farcaster Mini-App SDK
 * Uses the official @farcaster/miniapp-sdk useFarcaster hook
 */
export function useFarcasterMiniApp(): FarcasterMiniAppContext {
  const [context, setContext] = useState<FarcasterMiniAppContext>({
    isMiniApp: false,
    fid: null,
    username: null,
  });

  useEffect(() => {
    async function loadFarcaster() {
      try {
        // Dynamically import to avoid SSR issues
        const { useFarcaster } = await import('@farcaster/miniapp-sdk');
        const farcasterContext = useFarcaster();

        setContext({
          isMiniApp: farcasterContext.isMiniApp || false,
          fid: farcasterContext.fid || null,
          username: farcasterContext.username || null,
        });
      } catch (error) {
        // Not in Farcaster context - that's ok
        setContext({
          isMiniApp: false,
          fid: null,
          username: null,
        });
      }
    }

    loadFarcaster();
  }, []);

  return context;
}
