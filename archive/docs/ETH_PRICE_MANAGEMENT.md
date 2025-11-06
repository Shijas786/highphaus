# ⚠️ ETH Price Management - Critical Information

## The Problem

Your faucet has a **fundamental issue** with how ETH claims work:

### How It Currently Works:
1. **Smart Contract**: Distributes a **FIXED** amount of ETH (set at deployment)
   - Example: `claimAmount = 40000000000000000` wei (0.00004 ETH)
   
2. **UI Shows**: "GET $0.10 IN ETH"
   - This assumes ETH price is exactly $2,500
   - **$0.10 ÷ $2,500 = 0.00004 ETH** ✅

3. **The Issue**: ETH price fluctuates constantly!
   - If ETH = $2,000 → 0.00004 ETH = **$0.08** ❌
   - If ETH = $3,000 → 0.00004 ETH = **$0.12** ❌
   - If ETH = $4,000 → 0.00004 ETH = **$0.16** ❌

### **Result**: Users DON'T get exactly $0.10 worth of ETH!

## Solutions

### Option 1: **Regular Manual Updates** (Recommended)

**How it works:**
- Admin monitors ETH price
- When price changes significantly (>10%), update the contract
- Use the `setClaimAmount()` function

**Implementation:**

#### Step 1: Check Current Status
Visit: `https://your-site.com/api/admin/update-claim-amount`

Response shows:
```json
{
  "currentEthPrice": 3200,
  "recommended": {
    "ethAmount": "0.00003125",
    "weiAmount": "31250000000000000"
  }
}
```

#### Step 2: Update Contract
```bash
# Using cast (Foundry)
cast send <FAUCET_ADDRESS> \
  "setClaimAmount(uint256)" \
  31250000000000000 \
  --private-key $PRIVATE_KEY \
  --rpc-url https://mainnet.base.org
```

Or using Etherscan:
1. Go to your contract on BaseScan
2. Connect wallet
3. Call `setClaimAmount(31250000000000000)`

#### Step 3: Verify
Check the contract:
```bash
cast call <FAUCET_ADDRESS> "claimAmount()" --rpc-url https://mainnet.base.org
```

### Option 2: **Automated Updates** (Advanced)

Create a cron job or service that:
1. Checks ETH price every hour
2. Calculates if claim amount needs updating (>10% deviation)
3. Automatically calls `setClaimAmount()` on the contract

**WARNING:** Requires keeping private key in server environment (security risk)

### Option 3: **On-Chain Oracle** (Most Accurate, Most Complex)

Modify smart contract to use Chainlink Price Feed:
```solidity
// Get real-time ETH price from Chainlink
function getClaimAmount() public view returns (uint256) {
    int256 ethPrice = priceFeed.latestAnswer(); // Get ETH/USD price
    uint256 targetUsd = 10; // $0.10 in cents
    return (targetUsd * 1e18) / uint256(ethPrice); // Calculate ETH amount
}
```

**Pros:** Always accurate, no manual updates  
**Cons:** Requires contract redeployment, more gas costs

### Option 4: **Switch to USDC Claims** (Simplest!)

Instead of giving ETH, give USDC:
- 1 USDC = $1 always (stablecoin)
- No price fluctuation issues
- Users get exactly $0.10 in USDC every time

**Implementation:** Deploy new faucet contract that distributes USDC instead of ETH

## Current Implementation

### ✅ What We've Added:

1. **Real-Time ETH Price Fetching**
   - `src/hooks/use-eth-price.ts` - Fetches from CoinGecko every minute
   - Shows current ETH price on UI

2. **Claim Amount Calculator**
   - `src/lib/claim-amount-calculator.ts` - Calculate exact wei for $0.10
   - Helpers to check if update needed

3. **Admin API**
   - `GET /api/admin/update-claim-amount` - Get recommended claim amount
   - `POST /api/admin/update-claim-amount` - Check if update needed

4. **Updated UI**
   - Shows: "≈ 0.00004 ETH (at $2,500/ETH)"
   - Displays current ETH price
   - Clear messaging: "$0.10 USD at current ETH price"

### How to Use:

#### Check if Update Needed:
```bash
curl https://your-site.com/api/admin/update-claim-amount
```

#### Monitor Deviation:
```typescript
// Use the useClaimAmount hook
const { needsUpdate, deviation, claimAmountUsd } = useClaimAmount();

if (needsUpdate) {
  console.warn(`Claim amount deviates by ${deviation} from $0.10 target`);
  console.warn(`Current value: $${claimAmountUsd}`);
}
```

## Recommendation

### For Quick Launch:
**Use Option 1 (Manual Updates)**
- Simple and secure
- Check price weekly
- Update when deviation > 10%
- Takes 5 minutes

### For Long Term:
**Switch to USDC** (like you're doing for donations!)
- Deploy USDC faucet instead
- No price management needed
- Users always get exactly $0.10
- Much simpler

## Example Workflow

### Weekly Price Check:
```bash
# Monday morning routine
1. curl https://your-site.com/api/admin/update-claim-amount
2. Check the "deviation" field
3. If > 10%, copy the recommended weiAmount
4. Run: cast send <FAUCET> "setClaimAmount(uint256)" <WEI_AMOUNT> ...
5. Done!
```

### Automated Script:
```bash
#!/bin/bash
# check-claim-amount.sh

RESPONSE=$(curl -s https://your-site.com/api/admin/update-claim-amount)
NEEDS_UPDATE=$(echo $RESPONSE | jq -r '.needsUpdate')

if [ "$NEEDS_UPDATE" == "true" ]; then
  echo "⚠️  Claim amount needs updating!"
  echo $RESPONSE | jq '.recommendation'
  # Optional: Send yourself an email/notification
else
  echo "✅ Claim amount is good"
fi
```

Run via cron:
```bash
# Run every day at 9 AM
0 9 * * * /path/to/check-claim-amount.sh
```

## Files Reference

### Core Files:
- `src/hooks/use-eth-price.ts` - Fetch real-time ETH price
- `src/hooks/use-claim-amount.ts` - Read claim amount from contract
- `src/lib/claim-amount-calculator.ts` - Calculate optimal claim amount
- `src/app/api/admin/update-claim-amount/route.ts` - Admin API
- `contracts/Faucet.sol` - Smart contract with setClaimAmount()

### Smart Contract Functions:
```solidity
// Read current claim amount (anyone can call)
function claimAmount() public view returns (uint256);

// Update claim amount (only owner can call)
function setClaimAmount(uint256 _newAmount) external onlyOwner;
```

## Summary

**Problem**: Smart contract gives fixed ETH amount, but ETH price changes → Users don't get exactly $0.10

**Solution**: Either:
1. ✅ **Update contract regularly** when ETH price changes
2. ✅ **Switch to USDC faucet** (no price issues)
3. ❌ **Do nothing** (users will get varying USD amounts)

**Our Recommendation**: 
- **Short term**: Use manual updates (simple, secure)
- **Long term**: Switch to USDC faucet (best UX)

---

**Next Steps:**
1. Decide on approach (manual updates or USDC switch)
2. Set up monitoring (daily/weekly price checks)
3. Update claim amount when needed
4. Consider USDC faucet for v2

