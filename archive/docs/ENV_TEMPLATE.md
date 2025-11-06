# 🔐 Environment Variables Setup

Copy this template to create your `.env.local` file:

```env
# ===================================
# PRIVY AUTHENTICATION
# ===================================
# Get from: https://privy.io
# 1. Create account
# 2. Create new app
# 3. Copy App ID from dashboard
# 4. Enable Farcaster login in app settings
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# ===================================
# WALLETCONNECT (Optional - Legacy)
# ===================================
# Get from: https://cloud.walletconnect.com
# Only needed if keeping WalletConnect as fallback
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# ===================================
# FAUCET CONTRACT
# ===================================
# Your deployed BaseFarcasterAuthFaucet contract address
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# ===================================
# BACKEND SIGNER (Server-side ONLY!)
# ===================================
# ⚠️  NEVER commit this to Git!
# ⚠️  Used for signing Base App attestations
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Or use existing wallet private key
SIGNER_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# ===================================
# ENVIRONMENT CONFIG
# ===================================
# Set to "true" for local testing without blockchain
NEXT_PUBLIC_MOCK_MODE=false

# ===================================
# CLAIM CONFIGURATION
# ===================================
# Default claim amount in ETH (fallback if price feed fails)
NEXT_PUBLIC_CLAIM_AMOUNT_ETH=0.00004
```

## 🚀 Quick Setup

### 1. Copy Template
```bash
cp ENV_TEMPLATE.md .env.local
```

### 2. Get Privy App ID
1. Go to https://privy.io
2. Sign up / Login
3. Create new app
4. Copy App ID
5. Paste into `NEXT_PUBLIC_PRIVY_APP_ID`

### 3. Enable Farcaster
1. In Privy dashboard
2. Go to "Login methods"
3. Enable "Farcaster"
4. Save settings

### 4. Generate Backend Signer
```bash
# Option 1: Random new key
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use existing wallet
# Just paste your private key
```

**⚠️  IMPORTANT**: 
- Keep `SIGNER_PRIVATE_KEY` secret!
- Never commit `.env.local` to Git
- This key signs attestations for Base App users

### 5. Deploy Contract & Get Address
```bash
# Deploy BaseFarcasterAuthFaucet
forge create contracts/BaseFarcasterAuthFaucet.sol:BaseFarcasterAuthFaucet \
  --rpc-url https://mainnet.base.org \
  --private-key $DEPLOYER_KEY \
  --constructor-args <BACKEND_SIGNER_ADDRESS>

# Copy deployed address to NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS
```

### 6. Verify Setup
```bash
# Check .env.local
cat .env.local

# Should see:
# ✅ NEXT_PUBLIC_PRIVY_APP_ID (starts with "clm...")
# ✅ SIGNER_PRIVATE_KEY (starts with "0x")
# ✅ NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS (starts with "0x")
```

## 🧪 Testing

### Test with Mock Mode:
```env
NEXT_PUBLIC_MOCK_MODE=true
```
- No blockchain interaction
- No Privy API calls
- Perfect for UI development

### Test on Base Sepolia (Testnet):
```env
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=<testnet_contract>
```
- Real transactions
- Free testnet ETH
- Safe testing environment

### Production (Base Mainnet):
```env
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_FAUCET_CONTRACT_ADDRESS=<mainnet_contract>
```
- Real money! 💰
- Double-check everything

## ⚠️  Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] `SIGNER_PRIVATE_KEY` never committed
- [ ] Privy App ID is correct
- [ ] Contract address verified on BaseScan
- [ ] Backend signer address matches contract
- [ ] Rate limiting enabled on API
- [ ] Environment variables set in Vercel/hosting

## 📝 Notes

### Backend Signer Address:
To get the address from private key:
```bash
# Using cast (Foundry)
cast wallet address $SIGNER_PRIVATE_KEY

# Using ethers
node -e "console.log(new (require('ethers').Wallet)('YOUR_PRIVATE_KEY').address)"
```

This address must match the `backendSigner` in your smart contract!

### Testing Backend Attestation:
```bash
curl -X POST http://localhost:3000/api/sign-attestation \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "baseId": "did:privy:test123"
  }'

# Should return signature if SIGNER_PRIVATE_KEY is set correctly
```

---

**Ready!** Your environment is configured for Privy + Farcaster authentication! 🎉

