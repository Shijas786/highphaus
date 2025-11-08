# 🚀 Quick Start Guide

## What Just Happened?

Your Farcaster Gas Faucet has been completely refactored with:
- ✅ **48-hour recurring claims** (instead of one-time)
- ✅ **USDC contribution system** (min 1 USDC)
- ✅ **Dual NFT rewards** (OG Contributor + Claimer NFTs)
- ✅ **Tabbed interface** (Claim Gas | Support | NFTs)
- ✅ **Gasless transactions** (server pays all gas fees)
- ✅ **Countdown timers** for cooldown periods

**Your UI/design has been preserved!** Same athletic styling, colors, and brand aesthetic.

## 🎯 Next Steps (In Order)

### 1️⃣ Deploy the Smart Contract (30 minutes)

```bash
# The new contract is in:
/contracts/FarcasterGasFaucetWithNFT.sol

# Quick deployment using Remix:
1. Go to https://remix.ethereum.org/
2. Copy contract code from /contracts/FarcasterGasFaucetWithNFT.sol
3. Compile with Solidity 0.8.20+
4. Deploy to Base Mainnet with these parameters:
   - _usdcToken: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
   - _signerWallet: YOUR_SERVER_WALLET_ADDRESS
   - _claimAmount: 10000000000000000 (0.01 ETH)
   - baseURI: "https://your-domain.com/nft-metadata"
5. Fund contract with 1+ ETH
6. Save the contract address!
```

📚 **Full instructions:** See `DEPLOYMENT_INSTRUCTIONS.md`

### 2️⃣ Configure Environment Variables (5 minutes)

Create `.env.local` file:

```env
# Your deployed contract address from step 1
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere

# Server wallet private key (for gasless transactions)
FAUCET_PRIVATE_KEY=0xYourServerWalletPrivateKeyHere

# RPC URLs (default is fine)
BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org

# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Your domain
NEXT_PUBLIC_HOST=your-domain.com
```

### 3️⃣ Install Dependencies & Test Locally (5 minutes)

```bash
# Install new dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
# Test the three tabs:
# - Claim Gas (with countdown timer)
# - Support (USDC contribution)
# - NFTs (mint OG and Claimer NFTs)
```

### 4️⃣ Create NFT Metadata (15 minutes)

Create two JSON files:

**File 1: `og.json`** (OG Contributor NFT)
```json
{
  "name": "HighpHaus OG Contributor",
  "description": "Exclusive NFT for USDC contributors",
  "image": "YOUR_IMAGE_URL",
  "attributes": [
    {"trait_type": "Type", "value": "OG Contributor"},
    {"trait_type": "Network", "value": "Base"}
  ]
}
```

**File 2: `claimer.json`** (Gas Claimer NFT)
```json
{
  "name": "HighpHaus Gas Claimer",
  "description": "Commemorative NFT for gas claimers",
  "image": "YOUR_IMAGE_URL",
  "attributes": [
    {"trait_type": "Type", "value": "Gas Claimer"},
    {"trait_type": "Network", "value": "Base"}
  ]
}
```

Host these at your `baseURI` location or upload to IPFS.

### 5️⃣ Deploy to Production (10 minutes)

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or use Vercel dashboard:
1. Connect GitHub repo
2. Add environment variables from .env.local
3. Deploy
```

## 🧪 Testing Checklist

Before going live:

- [ ] **Claim Flow**
  - [ ] Connect wallet
  - [ ] Verify Farcaster authentication
  - [ ] Claim $0.03 ETH (gasless)
  - [ ] See countdown timer (48 hours)
  - [ ] Transaction appears on BaseScan
  
- [ ] **Contribution Flow**
  - [ ] Enter USDC amount (min $1)
  - [ ] Approve USDC spending
  - [ ] Contribute USDC
  - [ ] See confirmation
  
- [ ] **NFT Minting**
  - [ ] Check OG NFT eligibility (after contributing)
  - [ ] Mint OG NFT (gasless)
  - [ ] Check Claimer NFT eligibility (after claiming)
  - [ ] Mint Claimer NFT (gasless)
  - [ ] Verify NFT metadata displays
  
- [ ] **Cooldown System**
  - [ ] Wait 48 hours (or test on testnet with shorter cooldown)
  - [ ] Verify countdown accuracy
  - [ ] Claim again after cooldown
  
- [ ] **Tab Navigation**
  - [ ] All three tabs work
  - [ ] Active tab highlights correctly
  - [ ] Content displays properly

## 📊 What's Different?

### Before → After

| Feature | Before | After |
|---------|--------|-------|
| Claims | One-time only | Every 48 hours |
| Amount | $0.10 | $0.03 (adjustable) |
| Cooldown | None | 48 hours with timer |
| NFTs | One type | Two types (OG + Claimer) |
| Contributions | ETH only | USDC contributions |
| Interface | Single page | Three tabs |
| Gas | User pays | Server pays (gasless) |

### What Stayed the Same ✅

- Athletic design aesthetic
- Black/Blue color scheme
- Bold typography
- Geometric shapes
- Stats grid
- Footer design
- Farcaster integration

## 🔧 Key Files Changed

**New Files:**
```
/contracts/FarcasterGasFaucetWithNFT.sol   ← New contract
/src/components/ContributionCard.tsx       ← USDC contribution UI
/src/components/NFTSection.tsx             ← NFT minting UI
/src/hooks/use-claim-status.ts             ← Cooldown timer
/src/hooks/use-gasless-claim.ts            ← Gasless claims
/src/hooks/use-contribute.ts               ← USDC contributions
/src/hooks/use-nft-status.ts               ← NFT eligibility
/src/hooks/use-mint-nft.ts                 ← NFT minting
```

**Updated Files:**
```
/src/app/page.tsx                          ← Tabbed interface
/src/components/FaucetCard.tsx             ← Countdown timer
/src/app/api/claim/route.ts                ← Gasless logic
```

## 💰 Cost Estimate

**Deployment:**
- Smart contract: ~$50 (one-time)
- Initial ETH funding: $100+ (for claims)

**Per Transaction (paid by server):**
- Gasless claim: ~$0.01
- Gasless NFT mint: ~$0.02

**User Costs:**
- Claims: $0 (gasless)
- NFT minting: $0 (gasless)
- USDC contributions: Gas paid by user (~$0.10)

## 🆘 Troubleshooting

### "Contract address not configured"
→ Add `NEXT_PUBLIC_CONTRACT_ADDRESS` to `.env.local`

### "Gasless claim failed"
→ Check `FAUCET_PRIVATE_KEY` is correct and server wallet has ETH

### "Cannot claim yet"
→ 48-hour cooldown active. Check countdown timer.

### "Not eligible for OG NFT"
→ Must contribute ≥1 USDC first

### "Not eligible for Claimer NFT"
→ Must claim gas at least once first

## 📚 Full Documentation

- **Deployment Guide:** `DEPLOYMENT_INSTRUCTIONS.md`
- **Complete Summary:** `REFACTORING_SUMMARY.md`
- **Environment Variables:** `.env.example`

## 🎉 Success Criteria

You're ready to launch when:
- ✅ Smart contract deployed and funded
- ✅ Environment variables configured
- ✅ NFT metadata hosted
- ✅ All tests pass
- ✅ Frontend deployed to production
- ✅ Tested in Farcaster Mini-App

## 📞 Support

If you encounter issues:
1. Check contract on BaseScan for errors
2. Review API logs in Vercel dashboard
3. Verify all environment variables
4. Test contract functions directly on BaseScan
5. Check NFT metadata URLs are accessible

---

## 🚀 Ready to Launch?

```bash
# Final checklist:
✅ Contract deployed
✅ Contract funded with ETH
✅ Environment variables set
✅ NFT metadata created
✅ Local testing complete
✅ Deployed to production
✅ Tested in Farcaster

# Launch command:
vercel --prod
```

**You're all set!** 🎉

Your Farcaster Gas Faucet with NFT rewards is ready to help builders on Base!

