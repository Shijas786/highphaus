'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useMemo } from 'react';

export interface FarcasterContext {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  isFrameContext: boolean;
}

/**
 * Hook to get Farcaster context from Privy
 * Works with both Farcaster Mini-App and direct Farcaster login
 */
export function useFarcasterContext() {
  const { user, ready } = usePrivy();

  const context = useMemo<FarcasterContext>(() => {
    // Check if user has Farcaster account linked via Privy
    if (user?.farcaster) {
      return {
        fid: user.farcaster.fid ?? undefined,
        username: user.farcaster.username ?? undefined,
        displayName: user.farcaster.displayName ?? undefined,
        pfpUrl: user.farcaster.pfp ?? undefined,
        isFrameContext: true,
      };
    }

    // No Farcaster context
    return {
      isFrameContext: false,
    };
  }, [user]);

  return {
    ...context,
    isLoading: !ready,
    error: undefined,
  };
}
