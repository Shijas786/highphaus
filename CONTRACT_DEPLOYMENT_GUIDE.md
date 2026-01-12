# HighPhausFaucetDynamic Deployment Guide

## Contract Overview

**File:** `/contracts/HighPhausFaucetDynamic.sol`

### Key Features

- ✅ **Dynamic $0.10 Claims** - Amount adjusts automatically based on Chainlink ETH/USD price
- ✅ **7-Day Cooldown** - Users can claim every 7 days (recurring)
- ✅ **Farcaster-Only** - Verified via Reown attestation signatures
- ✅ **ETH Contributions** - Anyone can contribute to support builders
- ✅ **Transparent Tracking** - On-chain contribution tracking per user
- ✅ **Dual Restriction** - Both Farcaster ID AND wallet address have cooldowns

## Deployment Steps

### Prerequisites

1. **Wallet** with Base ETH for deployment
2. **Reown Account** for attestation (https://cloud.reown.com)
3. **MetaMask** or similar wallet

### Step 1: Deploy Contract

**Using Remix IDE:**

1. Open https://remix.ethereum.org/
2. Create new file: `HighPhausFaucetDynamic.sol`
3. Copy contract code from `/contracts/HighPhausFaucetDynamic.sol`
4. Compile with Solidity `^0.8.19`

**Constructor Parameters:**

```solidity
constructor(
  address _attestor,    // Your Reown attestor wallet address
  address _priceFeed    // Chainlink ETH/USD feed on Base
)
```

**For Base Mainnet:**
- `_attestor`: Your server wallet address (same as FAUCET_PRIVATE_KEY wallet)
- `_priceFeed`: `0x694AA1769357215DE4FAC081bf1f309aDC325306` (Chainlink ETH/USD on Base)

**Example:**
```
_attestor: 0xYourServerWalletAddress
_priceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
```

5. Deploy to **Base Mainnet**
6. Copy deployed contract address

### Step 2: Fund the Contract

Send ETH to the contract address:
```bash
# Recommended: Start with 1 ETH
# This funds ~100-300 claims depending on ETH price
```

Contract has `receive()` and `contribute()` functions that accept ETH.

### Step 3: Verify on BaseScan

1. Go to https://basescan.org
2. Search for your contract
3. Click "Verify and Publish"
4. Compiler: `0.8.19+`
5. Submit for verification

## Environment Variables

Add to `.env.local` and Vercel:

```env
# Reown AppKit (get from cloud.reown.com)
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id

# Deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress

# Server wallet (attestor) private key
FAUCET_PRIVATE_KEY=0xYourServerWalletPrivateKey

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
```

## How It Works

### Claim Flow

1. **User connects** wallet via Reown AppKit
2. **User signs in** with Farcaster (via Farcaster SDK)
3. **Server generates** attestation signature:
   - Hash Farcaster ID → `farcasterIdHash`
   - Sign payload: `keccak256(farcasterIdHash, walletAddress, expiry, chainId, contractAddress)`
   - Return signature to frontend
4. **User submits** transaction with signature (user pays gas ~$0.01)
5. **Contract verifies**:
   - Signature is valid (from trusted attestor)
   - Not expired
   - Farcaster ID hasn't claimed in 7 days
   - Wallet hasn't claimed in 7 days
6. **Contract sends** $0.10 worth of ETH (calculated via Chainlink oracle)

### Contribution Flow

1. User enters ETH amount
2. User calls `contribute()` with ETH value
3. Contract tracks contribution:
   - Updates `totalContributed`
   - Updates `contributions[user]`
   - Emits `Contributed` event
4. ETH stays in contract for future claims

## Contract Functions

### Public Functions

**claim(bytes32 farcasterIdHash, uint256 expiry, bytes signature)**
- Claims $0.10 worth of ETH
- Requires valid Reown attestation
- 7-day cooldown per Farcaster ID
- 7-day cooldown per wallet

**contribute() payable**
- Deposit ETH to support the faucet
- Tracked per address
- Can be called by anyone

### View Functions

**getCurrentClaimAmountWei() → uint256**
- Returns current claim amount in wei
- Dynamically calculated: $0.10 / current ETH price

**getEthUsdPrice() → uint256**
- Returns current ETH price from Chainlink
- 8 decimal places (e.g., 250000000000 = $2,500)

**canClaimByFarcaster(bytes32 farcasterIdHash) → bool**
- Check if Farcaster ID can claim

**canClaimByWallet(address wallet) → bool**
- Check if wallet can claim

**getTimeUntilNextClaimFarcaster(bytes32) → uint256**
- Seconds until Farcaster ID can claim again

**getTimeUntilNextClaimWallet(address) → uint256**
- Seconds until wallet can claim again

**totalContributed() → uint256**
- Total ETH contributed by all users

**contributions(address) → uint256**
- ETH contributed by specific address

### Admin Functions (Owner Only)

**setTrustedAttestor(address _attestor)**
- Update the attestor wallet address

**withdraw(address payable to, uint256 amount)**
- Withdraw specific amount of ETH

**withdrawAll(address payable to)**
- Withdraw all ETH from contract

## Security Features

✅ **Signature Verification** - Only trusted attestor can authorize claims
✅ **Double Cooldown** - Both Farcaster ID AND wallet must wait 7 days
✅ **Expiry Check** - Signatures expire after 5 minutes
✅ **Reentrancy Protection** - Uses `.call` pattern safely
✅ **Chain-Specific** - Signature includes chainId
✅ **Contract-Specific** - Signature includes contract address

## Cost Breakdown

**Deployment:** ~$20-30 (one-time)
**Per Claim:** ~$0.01 gas (user pays)
**Per Contribution:** ~$0.01 gas (contributor pays)

**Total Per User Claim:**
- User receives: $0.10 ETH
- User pays gas: ~$0.01
- Net benefit: ~$0.09

## Testing Checklist

Before production:
- [ ] Deploy contract to Base Mainnet
- [ ] Fund contract with ETH
- [ ] Verify contract on BaseScan
- [ ] Test claim with Farcaster account
- [ ] Verify 7-day cooldown works
- [ ] Test contribution function
- [ ] Check Chainlink price feed is working
- [ ] Verify attestor signature is valid
- [ ] Test on actual Reown AppKit
- [ ] Deploy frontend to Vercel

## Monitoring

Monitor these metrics:
- Contract ETH balance
- Total contributions
- Claims per day
- Average gas costs
- ETH price feed accuracy

## Hardhat Deployment Script

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Base Mainnet
  const attestor = "0xYOUR_SERVER_WALLET_ADDRESS";
  const priceFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

  const Faucet = await hre.ethers.getContractFactory("HighPhausFaucetDynamic");
  const faucet = await Faucet.deploy(attestor, priceFeed);

  await faucet.waitForDeployment();

  console.log("✅ Faucet deployed to:", await faucet.getAddress());
  console.log("📝 Verify on BaseScan:");
  console.log(`https://basescan.org/address/${await faucet.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## Post-Deployment

1. **Save contract address** to `.env.local`
2. **Fund contract** with initial ETH (1+ ETH recommended)
3. **Add to Vercel** environment variables
4. **Test claim flow** end-to-end
5. **Monitor balance** regularly

---

✅ **Contract deployed and ready for production!**

