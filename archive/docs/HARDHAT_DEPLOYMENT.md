# 🔨 Hardhat Deployment Guide

## ✅ Hardhat Setup Complete

You now have Hardhat configured for deploying your BaseFarcasterAuthFaucet contract!

## 📋 Prerequisites

### 1. Update `.env.local` with deployment keys:

```bash
# Add these to your .env.local file:

# Deployer private key (for contract deployment)
DEPLOYER_PRIVATE_KEY=0xyour_deployer_private_key_here

# BaseScan API key (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key_here

# Optional: Custom RPC URLs
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 2. Get BaseScan API Key (for verification):
1. Go to https://basescan.org
2. Sign up / Login
3. Go to "API Keys"
4. Create new API key
5. Copy to `.env.local`

## 🚀 Deploy to Base Sepolia (Testnet)

### Test deployment:
```bash
npx hardhat run scripts/deploy-farcaster-faucet.js --network baseSepolia
```

**Expected output:**
```
🚀 Deploying BaseFarcasterAuthFaucet to Base...

Network: baseSepolia
Backend Signer Address: 0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637

Deploying with account: 0xYourAddress
Account balance: 0.1 ETH

Deploying BaseFarcasterAuthFaucet...
✅ BaseFarcasterAuthFaucet deployed to: 0xDeployedContractAddress

📋 Contract Configuration:
  Backend Signer: 0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637
  Target USD: 0.1 USD
  Owner: 0xYourAddress

📝 Add this to your .env.local:
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xDeployedContractAddress

✅ Contract verified!
🎉 Deployment complete!
```

### Fund the contract:
```bash
# Send 0.1 ETH to contract (testnet)
cast send <DEPLOYED_CONTRACT_ADDRESS> \
  --value 0.1ether \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

## 🌐 Deploy to Base Mainnet (Production)

### ⚠️ CHECKLIST before mainnet:
- [ ] Contract tested on Base Sepolia
- [ ] Backend attestation tested
- [ ] Privy integration tested
- [ ] Farcaster flow tested
- [ ] Enough ETH in deployer wallet
- [ ] BaseScan API key configured

### Deploy:
```bash
npx hardhat run scripts/deploy-farcaster-faucet.js --network base
```

### Fund with real ETH:
```bash
# Send 1 ETH to contract (production)
cast send <DEPLOYED_CONTRACT_ADDRESS> \
  --value 1ether \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url https://mainnet.base.org
```

## 🔍 Verify Contract Manually

If auto-verification fails:

```bash
npx hardhat verify --network baseSepolia \
  <DEPLOYED_CONTRACT_ADDRESS> \
  0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637
```

For mainnet:
```bash
npx hardhat verify --network base \
  <DEPLOYED_CONTRACT_ADDRESS> \
  0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637
```

## 🧪 Test Contract Locally

### Start local Hardhat node:
```bash
npx hardhat node
```

### Deploy to local network:
```bash
npx hardhat run scripts/deploy-farcaster-faucet.js --network localhost
```

## 📝 After Deployment

### 1. Update `.env.local`:
```env
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 2. Restart your dev server:
```bash
npm run dev
```

### 3. Test the integration:
- Connect with Privy
- Try claiming with Farcaster
- Try claiming with Base App
- Check backend attestation endpoint

## 🛠️ Useful Commands

### Check contract balance:
```bash
cast balance <CONTRACT_ADDRESS> --rpc-url https://sepolia.base.org
```

### Call contract functions:
```bash
# Check target USD
cast call <CONTRACT_ADDRESS> "targetUsdCents()" --rpc-url https://sepolia.base.org

# Check backend signer
cast call <CONTRACT_ADDRESS> "backendSigner()" --rpc-url https://sepolia.base.org

# Check if wallet can claim
cast call <CONTRACT_ADDRESS> "canClaimWallet(address)" <WALLET_ADDRESS> --rpc-url https://sepolia.base.org
```

### Update backend signer (owner only):
```bash
cast send <CONTRACT_ADDRESS> \
  "setBackendSigner(address)" <NEW_SIGNER_ADDRESS> \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --rpc-url https://sepolia.base.org
```

## 🚨 Troubleshooting

### Error: "insufficient funds"
- Make sure deployer wallet has enough ETH
- Base Sepolia: Get testnet ETH from https://www.alchemy.com/faucets/base-sepolia
- Base Mainnet: Bridge ETH from Ethereum mainnet

### Error: "Invalid API Key"
- Check BASESCAN_API_KEY in .env.local
- Make sure it's from basescan.org, not etherscan.io

### Error: "nonce too low"
- Clear pending transactions
- Or wait a few minutes and try again

### Contract not verified
- Wait 1-2 minutes after deployment
- Run manual verification command
- Check constructor arguments match

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Base Documentation](https://docs.base.org)
- [BaseScan](https://basescan.org)
- [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)

---

**Status**: ✅ Hardhat configured and ready to deploy!

**Backend Signer**: `0xC3323D12a35081a45d7Ff1F7EeD6f50038CB4637`

Run: `npx hardhat run scripts/deploy-farcaster-faucet.js --network baseSepolia`

