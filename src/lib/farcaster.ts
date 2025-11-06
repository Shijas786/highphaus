/**
 * Farcaster Mini-App SDK helpers
 * Based on: https://miniapps.farcaster.xyz/docs/getting-started
 */

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface FarcasterContext {
  user: FarcasterUser;
}

/**
 * Check if we're running inside a Farcaster miniapp
 */
export function isFarcasterMiniapp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if we're in an iframe (miniapp context)
  return window.parent !== window;
}

/**
 * Initialize Farcaster SDK and get user context
 * Returns user context if successful, null otherwise
 */
export async function initializeFarcasterSDK(): Promise<FarcasterContext | null> {
  try {
    // Only load SDK in browser and if in miniapp
    if (typeof window === 'undefined' || !isFarcasterMiniapp()) {
      return null;
    }

    // Dynamically import SDK to avoid SSR issues
    const { sdk } = await import('@farcaster/miniapp-sdk');
    
    // Get user context
    const context = await sdk.context;
    
    // Notify Farcaster that app is ready (removes splash screen)
    await sdk.actions.ready();
    
    console.log('✅ Farcaster SDK initialized', context);
    
    if (context?.user) {
      return {
        user: {
          fid: context.user.fid,
          username: context.user.username,
          displayName: context.user.displayName,
          pfpUrl: context.user.pfpUrl,
        },
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to initialize Farcaster SDK:', error);
    return null;
  }
}

/**
 * Get Farcaster user from Privy
 * Useful when user logs in via Privy's Farcaster integration
 */
export function getFarcasterUserFromPrivy(privyUser: any): FarcasterUser | null {
  if (!privyUser?.farcaster) return null;
  
  return {
    fid: privyUser.farcaster.fid,
    username: privyUser.farcaster.username,
    displayName: privyUser.farcaster.displayName,
    pfpUrl: privyUser.farcaster.pfp,
  };
}

