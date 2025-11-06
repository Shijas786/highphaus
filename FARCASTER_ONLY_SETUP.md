# Farcaster-Only Faucet Setup

## Overview
Your faucet is configured for **Farcaster users only**. Users must have a Farcaster account to claim ETH.

## ✅ What We Fixed

### 1. **Removed Outdated Frame SDK**
**Before:** Using `@farcaster/frame-sdk` (for Frames only)
```typescript
import sdk from '@farcaster/frame-sdk';
const frameContext = await sdk.context;
```

**After:** Using Privy's Farcaster integration (works everywhere)
```typescript
import { usePrivy } from '@privy-io/react-auth';
const { user } = usePrivy();
const fid = user?.farcaster?.fid;
```

**Benefits:**
- ✅ Works in Mini-Apps, web, and mobile
- ✅ More reliable and maintained
- ✅ Better integration with your auth flow
- ✅ No frame-specific metadata needed

### 2. **Updated Farcaster Context Hook**
The `use-farcaster-context.ts` hook now pulls Farcaster data directly from Privy instead of the deprecated Frame SDK.

## Current Architecture

### Contract (Already Deployed)
```solidity
// Address: 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db
contract BaseFarcasterFaucet {
    function claimFarcaster() external;
}
```

### Frontend Flow
1. User logs in with Privy (Farcaster required)
2. Privy provides Farcaster FID
3. User clicks "Claim"
4. Contract checks FID on-chain via Farcaster ID Registry
5. ETH sent if FID hasn't claimed before

## Who Can Claim?

✅ **Can Claim:**
- Users with Farcaster accounts
- Each Farcaster ID (FID) can claim once

❌ **Cannot Claim:**
- Users without Farcaster accounts
- Email-only users
- SMS-only users
- Wallet-only users

## Key Files

| File | Purpose |
|------|---------|
| `hardhat-deploy/contracts/BaseFarcasterFaucet.sol` | Smart contract (deployed) |
| `src/hooks/use-farcaster-context.ts` | Gets Farcaster data from Privy |
| `src/hooks/use-privy-claim.ts` | Handles claim flow |
| `src/components/PrivyProviderWrapper.tsx` | Privy configuration |

## Configuration

### Required Environment Variables
```env
# Privy (handles Farcaster login)
NEXT_PUBLIC_PRIVY_APP_ID=cmhni9xo30171l50cunm9361e

# Contract (already deployed)
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x527585EE01F9a86B895b98Fb59E14d8C943cF6db
```

### Privy Login Methods
In `src/components/PrivyProviderWrapper.tsx`:
```typescript
loginMethods: ['wallet', 'farcaster', 'email', 'sms']
```

**Note:** Even though email/SMS are available for login, only users who **also link a Farcaster account** can claim.

## Testing

### 1. Test Farcaster Login
```bash
npm run dev
```
Visit http://localhost:3000 and:
1. Click login
2. Choose "Continue with Farcaster"
3. Connect your Farcaster account
4. Try claiming

### 2. Test Contract Directly
```bash
# Check if FID has claimed (example FID: 12345)
cast call 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db \
  "fidClaimed(uint256)" 12345 \
  --rpc-url https://sepolia.base.org

# Claim as Farcaster user
cast send 0x527585EE01F9a86B895b98Fb59E14d8C943cF6db \
  "claimFarcaster()" \
  --private-key $YOUR_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

## Future: Support Non-Farcaster Users

If you want to support email/SMS/wallet users in the future, you'll need to:

1. **Deploy new contract** with `claimBaseApp()` function
2. **Add backend signature generation** for non-Farcaster attestations
3. **Update frontend** to handle both claim types

For now, **Farcaster-only is simpler and works great!** 🎉

## Troubleshooting

### "No Farcaster account" error
- User must have a Farcaster account
- Link Farcaster in Privy settings

### "Already claimed" error
- Each FID can only claim once
- Check `fidClaimed` mapping in contract

### Privy not loading Farcaster data
- Ensure `farcaster: { enabled: true }` in Privy config
- Check Privy dashboard for Farcaster integration

## Resources

- [Privy Farcaster Docs](https://docs.privy.io/guide/react/recipes/farcaster)
- [Farcaster ID Registry](https://docs.farcaster.xyz/reference/contracts/reference/id-registry)
- [Your Deployed Contract](https://sepolia.basescan.org/address/0x527585EE01F9a86B895b98Fb59E14d8C943cF6db)

---

**Status:** ✅ Farcaster-only faucet ready to use!  
**Last Updated:** 2025-11-06

