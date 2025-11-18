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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__FARCASTER__ === true;

  return isInIframe || hasFarcasterIndicators;
}

/**
 * Initialize Farcaster SDK and get user context
 * CRITICAL: Always calls sdk.actions.ready() to hide loading screen, even on error
 */
export async function initializeFarcasterSDK(): Promise<FarcasterContext | null> {
  let sdk: any = null;
  
  try {
    // Check if we're in a Farcaster miniapp environment
    if (typeof window === 'undefined') return null;

    // Only initialize once
    if (isInitialized && sdkInstance) {
      const context = await sdkInstance.context;
      return context;
    }

    // Import SDK dynamically (only on client)
    const sdkModule = await import('@farcaster/miniapp-sdk');
    sdk = sdkModule.sdk;
    sdkInstance = sdk;
    isInitialized = true;

    // CRITICAL: Call ready() FIRST to hide loading screen immediately
    // Reference: https://miniapps.farcaster.xyz/docs/getting-started#making-your-app-display
    try {
      await sdk.actions.ready();
    } catch (readyError) {
      console.error('Failed to call sdk.actions.ready():', readyError);
    }

    // Get user context AFTER ready() is called
    const context: FarcasterContext = await sdk.context;

    return context;
  } catch (error) {
    console.error('Failed to initialize Farcaster SDK:', error);
    
    // CRITICAL: Even if initialization fails, we MUST call ready() to hide loading screen
    // Otherwise the miniapp will show a black screen forever
    if (sdk && typeof sdk.actions?.ready === 'function') {
      try {
        await sdk.actions.ready();
      } catch (readyError) {
        console.error('Failed to call sdk.actions.ready() in error handler:', readyError);
      }
    } else if (typeof window !== 'undefined') {
      // If SDK import failed, try to import again just to call ready()
      try {
        const { sdk: fallbackSdk } = await import('@farcaster/miniapp-sdk');
        if (fallbackSdk && typeof fallbackSdk.actions?.ready === 'function') {
          await fallbackSdk.actions.ready();
          console.log('✅ Called ready() via fallback SDK import');
        }
      } catch (readyError) {
        console.error('Failed to call ready() on fallback SDK:', readyError);
      }
    }
    
    return null;
  }
}

/**
 * Check if Farcaster wallet is available
 * Reference: https://miniapps.farcaster.xyz/docs/guides/ethereum
 */
export async function hasFarcasterWallet(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;

    const { sdk } = await import('@farcaster/miniapp-sdk');
    const wallet = await sdk.wallet.ethProvider;
    return !!wallet;
  } catch {
    return false;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
