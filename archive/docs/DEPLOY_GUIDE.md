# 🚀 Simple Deployment Guide

## Option 1: Deploy with Remix IDE (Easiest!)

### Step 1: Open Remix
Go to https://remix.ethereum.org

### Step 2: Create Contract File
1. Create new file: `BaseFarcasterAuthFaucet.sol`
2. Copy contents from: `contracts/BaseFarcasterAuthFaucet.sol`
3. Paste into Remix

### Step 3: Compile
1. Go to "Solidity Compiler" tab (left sidebar)
2. Select compiler version: `0.8.20`
3. Enable optimization (200 runs)
4. Click "Compile"

### Step 4: Deploy to Base Sepolia (Testnet)
1. Go to "Deploy & Run" tab
2. Set Environment: "Injected Provider - MetaMask"
3. Connect MetaMask to **Base Sepolia**
4. Constructor parameter:
   ```
   BACKEND_SIGNER: 0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637
   ```
5. Click "Deploy"
6. Confirm in MetaMask

### Step 5: Copy Contract Address
After deployment, copy the contract address and add to `.env.local`:
```env
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### Step 6: Fund Contract
Send ETH to your contract address:
```bash
# Testnet
cast send <CONTRACT_ADDRESS> \
  --value 0.1ether \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

### Step 7: Verify on BaseScan
1. Go to https://sepolia.basescan.org
2. Find your contract
3. Click "Verify & Publish"
4. Enter:
   - Compiler: 0.8.20
   - Optimization: Yes (200)
   - Constructor args: `0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637`

---

## Option 2: Deploy with Foundry (Advanced)

If you have Foundry installed:

```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy to Base Sepolia
forge create contracts/BaseFarcasterAuthFaucet.sol:BaseFarcasterAuthFaucet \
  --rpc-url https://sepolia.base.org \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --constructor-args 0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637 \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Fund contract
cast send <DEPLOYED_ADDRESS> \
  --value 0.1ether \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

---

## Option 3: Use Our Deployment Script

**(Requires contracts to be pre-compiled)**

```bash
# Add to .env.local first:
DEPLOYER_PRIVATE_KEY=0xyour_deployer_private_key
BASESCAN_API_KEY=your_basescan_key

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet (after testing!)
npm run deploy:mainnet
```

---

## 📝 Environment Setup

Create/update your `.env.local`:

```bash
cat >> .env.local << 'EOF'

# === DEPLOYMENT ===
DEPLOYER_PRIVATE_KEY=0x...your_deployer_private_key
BASESCAN_API_KEY=...your_basescan_api_key
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
EOF
```

---

## ✅ After Deployment

1. **Update contract address** in `.env.local`:
   ```env
   NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourAddress
   ```

2. **Test backend attestation**:
   ```bash
   npm run dev
   
   curl -X POST http://localhost:3000/api/sign-attestation \
     -H "Content-Type: application/json" \
     -d '{"wallet": "0x...", "baseId": "test123"}'
   ```

3. **Enable Farcaster** in Privy Dashboard:
   - Go to https://dashboard.privy.io
   - Enable Farcaster login

4. **Test the app**:
   - Open http://localhost:3000
   - Connect with Privy
   - Try claiming!

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| **Backend Signer** | `0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637` |
| **Privy App ID** | `cmhni9xo30171l50cunm9361e` |
| **Compiler** | Solidity 0.8.20 |
| **Base Sepolia RPC** | `https://sepolia.base.org` |
| **Base Mainnet RPC** | `https://mainnet.base.org` |

---

## 🚨 Troubleshooting

**Error: Insufficient funds**
- Get testnet ETH: https://www.alchemy.com/faucets/base-sepolia

**Error: Invalid signature**
- Make sure SIGNER_PRIVATE_KEY matches backend signer address

**Contract not verified**
- Use BaseScan manual verification
- Enter constructor args carefully

---

**Recommended**: Use **Remix IDE** (Option 1) - it's the easiest and most reliable! 🎯

