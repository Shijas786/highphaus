'use client';

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
  user?: FarcasterUser;
}

let sdkInstance: any = null;
let isInitialized = false;

/**
 * Check if running in Farcaster miniapp
 */
export function isFarcasterMiniapp(): boolean {
  if (typeof window === 'undefined') return false;

  // Best indicator: running in iframe
  const isInIframe = window.parent !== window;

  // Additional checks for Farcaster-specific context
  const hasFarcasterIndicators =
    window.location.href.includes('farcaster') ||
    window.location.href.includes('warpcast') ||
    (window as any).__FARCASTER__ === true;

  return isInIframe || hasFarcasterIndicators;
}

/**
 * Initialize Farcaster SDK and get user context
 */
export async function initializeFarcasterSDK(): Promise<FarcasterContext | null> {
  try {
    // Check if we're in a Farcaster miniapp environment
    if (typeof window === 'undefined') return null;

    // Only initialize once
    if (isInitialized && sdkInstance) {
      const context = await sdkInstance.context;
      return context;
    }

    // Import SDK dynamically (only on client)
    const { sdk } = await import('@farcaster/miniapp-sdk');
    sdkInstance = sdk;
    isInitialized = true;

    // Get user context
    const context: FarcasterContext = await sdk.context;

    // Call actions.ready() to hide loading screen
    // Reference: https://miniapps.farcaster.xyz/docs/getting-started#making-your-app-display
    await sdk.actions.ready();

    console.log('✅ Farcaster SDK initialized', context);

    return context;
  } catch (error) {
    console.error('Failed to initialize Farcaster SDK:', error);
    return null;
  }
}

/**
 * Get current Farcaster user
 */
export async function getFarcasterUser(): Promise<FarcasterUser | null> {
  const context = await initializeFarcasterSDK();
  return context?.user || null;
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

/**
 * Format Farcaster username with @ prefix
 */
export function formatFarcasterUsername(username?: string): string {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
}
