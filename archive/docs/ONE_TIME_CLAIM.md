# ✅ One-Time Claim Implementation

## Overview

The faucet now enforces **ONE CLAIM PER WALLET** - no cooldown, no repeat claims. Each wallet address can only claim once, EVER.

## What Changed

### 1. **Backend - Eligibility API** (`src/app/api/eligibility/route.ts`)
- ✅ Removed cooldown timer logic
- ✅ Now tracks wallets that have EVER claimed (using a Set)
- ✅ Returns `hasClaimed: true` if wallet already claimed
- ✅ Error message: "Already claimed - One claim per wallet only"

### 2. **Frontend - Eligibility Hook** (`src/hooks/use-eligibility.ts`)
- ✅ Updated to check if wallet has claimed (not cooldown)
- ✅ In mock mode: uses `localStorage` to track claimed wallets
- ✅ In production mode: calls API to verify

### 3. **Claim Hook** (`src/hooks/use-claim.ts`)
- ✅ After successful claim, marks wallet as "claimed"
- ✅ Notifies both `/api/claim` and `/api/eligibility` endpoints
- ✅ In mock mode: sets `hasClaimed_${address}` in localStorage

### 4. **Constants** (`src/config/constants.ts`)
- ✅ Removed `CLAIM_COOLDOWN_MINUTES`
- ✅ Added `ONE_TIME_CLAIM_ONLY = true`

### 5. **UI Updates** (`src/app/page.tsx`)
- ✅ Hero: "One-time claim per wallet • No strings attached • Instant delivery"
- ✅ Claim section: "Everyone gets $0.10 worth of ETH • One-time only • Instant"
- ✅ How it works: "• NO COST • ONE-TIME PER WALLET • INSTANT DELIVERY"
- ✅ Donate section: "Claiming is always free • One claim per wallet only"
- ✅ Footer: "FREE ETH FOR BUILDERS • ONE CLAIM PER WALLET • BASE NETWORK"

## How It Works Now

### User Flow:
1. **First time user** → Connects wallet → Eligible ✅ → Claims $0.10 ETH
2. **Wallet marked as claimed** in backend storage
3. **Same wallet returns** → "Already claimed - One claim per wallet only" ❌

### Storage:
- **Development/Mock Mode**: Uses browser `localStorage`
- **Production**: Uses in-memory `Set` (you'll want to replace with database)

## Important Notes

### ⚠️ Production Deployment
The current implementation uses **in-memory storage** which will reset when the server restarts. For production, you should:

1. **Use a Database** (PostgreSQL, MongoDB, etc.)
   ```typescript
   // Example with database
   const hasClaimed = await db.claims.findOne({ wallet: address });
   if (hasClaimed) {
     return { eligible: false, reason: 'Already claimed' };
   }
   ```

2. **Or use the Smart Contract**
   - The Solidity contract already tracks `lastClaimTime[address]`
   - You can check on-chain if `lastClaimTime[address] > 0`
   - This makes it truly immutable and decentralized

### 🔮 Farcaster Integration (Future)
When you add Farcaster integration later, you'll want to:
- Track both wallet address AND Farcaster FID
- Require users to sign in with Farcaster
- Check if either the wallet OR the FID has claimed
- Store both in database: `{ wallet, fid, timestamp }`

## Testing

### Test in Mock Mode:
1. Connect a wallet → Should be eligible
2. Claim → Should succeed
3. Disconnect and reconnect same wallet → Should show "Already claimed"
4. Clear localStorage → Should be eligible again (for testing)

### Test in Production Mode:
1. Deploy smart contract with very long cooldown (or modify contract)
2. Connect wallet → Claim
3. Reconnect → Contract will prevent second claim

## Files Modified

- ✅ `src/config/constants.ts` - Added ONE_TIME_CLAIM_ONLY
- ✅ `src/app/api/eligibility/route.ts` - One-time verification
- ✅ `src/hooks/use-eligibility.ts` - Frontend eligibility check
- ✅ `src/hooks/use-claim.ts` - Mark wallet as claimed
- ✅ `src/app/page.tsx` - UI messaging updates

## Smart Contract Note

The existing Faucet.sol contract has:
```solidity
mapping(address => uint256) public lastClaimTime;

function canClaim(address user) public view returns (bool) {
    if (lastClaimTime[user] == 0) {
        return true;
    }
    return block.timestamp >= lastClaimTime[user] + cooldownTime;
}
```

To make it truly one-time only on-chain:
- Set `cooldownTime` to a very large number (e.g., 100 years)
- Or modify contract to remove cooldown entirely and only allow one claim per address

---

**Status**: ✅ One-time claim per wallet is now enforced
**Next Steps**: Add Farcaster integration to verify one claim per Farcaster account

